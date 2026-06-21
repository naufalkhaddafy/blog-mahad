<?php

namespace App\Jobs;

use App\Models\Channel;
use App\Events\RadioUpdate;
use App\Http\Resources\ChannelResource;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class ProcessChannelStatsJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $channel;

    /**
     * The number of seconds after which the job's unique lock will be released.
     *
     * @var int
     */
    public $uniqueFor = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(Channel $channel)
    {
        $this->channel = $channel;
    }

    /**
     * The unique ID of the job.
     */
    public function uniqueId(): string
    {
        return $this->channel->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $channel = $this->channel;
        $slug = Str::slug($channel->name);
        $key = "shoutcast:channel:{$slug}:last_data";

        $cached = Redis::get($key);
        $old = $cached ? json_decode($cached, true) : [];

        $isOffline = false;
        $resp = Http::timeout(10)->get($channel->url . '/stats?sid=1&json=1');
        if (!$resp->successful() || !($new = $resp->json())) {
            $isOffline = true;
            Log::error("Failed to fetch/decode stats for channel: {$channel->name}");
        }

        $gracePeriodKey = "shoutcast:channel:{$slug}:grace_period";

        if ($isOffline) {
            $titleNow = false;
            $new = [
                'uniquelisteners' => 0,
                'servertitle' => $channel->name,
                'songtitle' => 'Radio Offline (Buffering...)',
            ];
        } else {
            $newTitle = $new['songtitle'] ?? null;
            $titleNow = Str::contains(Str::upper($newTitle ?? ''), ['LIVE', 'ONAIR']);
        }

        $newStatus = 'record';
        if ($titleNow) {
            $newStatus = 'live';
            Redis::del($gracePeriodKey);
        } else {
            if ($channel->status?->value === 'live') {
                $graceStart = Redis::get($gracePeriodKey);
                if (!$graceStart) {
                    Redis::set($gracePeriodKey, time());
                    $newStatus = 'live';
                    Log::warning("Channel {$channel->name} lost LIVE signal. Starting 5-min grace period.");
                } else {
                    if (time() - $graceStart > 300) {
                        $newStatus = 'record';
                        Redis::del($gracePeriodKey);
                        Log::info("Grace period ended for {$channel->name}. Changing status to record.");
                    } else {
                        $newStatus = 'live';
                    }
                }
            } else {
                $newStatus = 'record';
                Redis::del($gracePeriodKey);
            }
        }

        // Cek perubahan title
        $oldTitle = $old['songtitle'] ?? null;
        $oldListeners = $old['currentlisteners'] ?? null;
        $newTitle = $new['songtitle'] ?? null;
        $newListeners = $new['uniquelisteners'] ?? null;
        $titleChanged = ($oldTitle !== $newTitle);
        $listenersChanged = ($oldListeners !== $newListeners);

        // Update hanya jika status berubah
        // Update hanya jika status berubah
        if ($channel->status?->value !== $newStatus) {
            if ($newStatus == 'live') {
                $this->startRecording($channel, $newTitle);

                Log::info('Webhook URL:', ['url' => config('services.n8n.webhook_url')]);
                if (config('services.n8n.webhook_url')) {
                    Http::timeout(10)->post(config('services.n8n.webhook_url'), [
                        'channel' => $channel->name,
                        'description' => str_ireplace(['live', 'onair'], '', $newTitle),
                    ]);
                } else {
                    Log::warning('N8N webhook URL is not set.');
                }
            } else {
                $this->stopRecording($channel);
            }
            $channel->update(['status' => $newStatus]);
            Log::info("Update status channel {$channel->name} dari {$channel->status?->value} ke {$newStatus}");
        } else {
            // Jika tetap LIVE, pantau apakah proses FFMPEG mati
            if ($newStatus === 'live') {
                $activeRecording = \App\Models\Recording::where('channel_id', $channel->id)->where('status', 'recording')->latest()->first();
                if ($activeRecording && $activeRecording->ffmpeg_pid) {
                    if (!$this->isProcessRunning($activeRecording->ffmpeg_pid)) {
                        Log::warning("FFMPEG process {$activeRecording->ffmpeg_pid} died unexpectedly for {$channel->name}. Restarting recording...");
                        
                        $absolutePath = storage_path('app/public/' . $activeRecording->file_path);
                        $size = file_exists($absolutePath) ? filesize($absolutePath) : 0;
                        $activeRecording->update([
                            'status' => 'completed',
                            'file_size' => $size,
                        ]);

                        $this->startRecording($channel, $newTitle);
                    }
                }
            }
        }

        $dataSource = [
            ...$channel->toArray(),
            'currentlisteners' => $new['uniquelisteners'] ?? 0,
            'servertitle' => $new['servertitle'] ?? null,
            'songtitle' => $new['songtitle'] ?? null,
            'status' => $newStatus,
        ];

        // set new data to Redis
        Redis::set($key, json_encode($dataSource));

        //Log Changes
        if ($titleChanged || $listenersChanged) {
            // event(new RadioUpdate(ChannelResource::make($dataSource)->resolve()));
            Log::info("Perubahan data pada channel: {$channel->name} - Title: {$newTitle}, Listeners: {$newListeners}");
        } else {
            Log::info("Tidak ada perubahan data pada channel: {$channel->name}");
        }
    }

    protected function startRecording(Channel $channel, $title)
    {
        $fileName = Str::slug($channel->name . '-' . now()->format('Y-m-d-H-i-s')) . '.mp3';
        $filePath = 'recordings/' . $fileName;
        $absolutePath = storage_path('app/public/' . $filePath);

        if (!file_exists(storage_path('app/public/recordings'))) {
            mkdir(storage_path('app/public/recordings'), 0755, true);
        }

        $parsedUrl = parse_url($channel->url);
        $streamUrl = rtrim($channel->url, '/');
        // Hanya tambahkan /; jika URL tidak memiliki path (untuk Shoutcast v1)
        if (!isset($parsedUrl['path']) || $parsedUrl['path'] == '') {
            $streamUrl .= '/;';
        }

        $logFile = storage_path('logs/ffmpeg-' . $channel->id . '.log');
        $cmd = "nohup ffmpeg -reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 10 -user_agent \"Mozilla/5.0 (Windows NT 10.0; Win64; x64)\" -i " . escapeshellarg($streamUrl) . " -c:a libmp3lame -b:a 64k " . escapeshellarg($absolutePath) . " > " . escapeshellarg($logFile) . " 2>&1 & echo $!";
        $pid = trim(shell_exec($cmd));

        $timeString = now()->timezone('Asia/Makassar')->format('d M Y H:i \W\I\T\A');
        $finalTitle = $title ? ($title . ' - ' . $timeString) : ('Rekaman ' . $channel->name . ' ' . $timeString);

        \App\Models\Recording::create([
            'channel_id' => $channel->id,
            'title' => $finalTitle,
            'file_path' => $filePath,
            'status' => 'recording',
            'ffmpeg_pid' => $pid,
        ]);

        Log::info("Started recording channel {$channel->name} with PID {$pid}");
    }

    protected function isProcessRunning($pid)
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            exec("tasklist /FI \"PID eq $pid\" 2>NUL", $output);
            return count($output) > 1 && strpos(implode(" ", $output), (string)$pid) !== false;
        } else {
            return trim(shell_exec("ps -p " . escapeshellarg($pid) . " -o pid=")) !== "";
        }
    }

    protected function stopRecording(Channel $channel)
    {
        $recordings = \App\Models\Recording::where('channel_id', $channel->id)
            ->where('status', 'recording')
            ->get();

        foreach ($recordings as $rec) {
            if ($rec->ffmpeg_pid) {
                if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                    exec("taskkill /F /PID " . escapeshellarg($rec->ffmpeg_pid) . " >NUL 2>&1");
                } else {
                    exec("kill -15 " . escapeshellarg($rec->ffmpeg_pid) . " >/dev/null 2>&1");
                }
            }
            
            $absolutePath = storage_path('app/public/' . $rec->file_path);
            $size = file_exists($absolutePath) ? filesize($absolutePath) : 0;

            $rec->update([
                'status' => 'completed',
                'file_size' => $size,
            ]);

            Log::info("Stopped recording for channel {$channel->name}. File size: {$size} bytes");
        }
    }
}
