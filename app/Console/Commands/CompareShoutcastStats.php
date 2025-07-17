<?php

namespace App\Console\Commands;

use App\Enums\ChannelStatus;
use App\Events\RadioUpdate;
use App\Http\Resources\ChannelResource;
use App\Models\Channel;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class CompareShoutcastStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'shoutcast:compare';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compare latest shoutcast stats per channel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Channel::whereNotIn('status', [ChannelStatus::Unactive])->get()
            ->each(function ($channel) {
                $slug = Str::slug($channel->name);
                $key = "shoutcast:channel:{$slug}:last_data";

                $cached = Redis::get($key);
                $old = $cached ? json_decode($cached, true) : [];

                $resp = Http::get($channel->url . '/stats?sid=1&json=1');
                if (!$resp->successful()) {
                    Log::error("HTTP request failed for channel: {$channel->name}");
                    return;
                }

                $new = $resp->json();
                if (!$new) {
                    Log::error("Failed to decode JSON for channel: {$channel->name}");
                    return;
                }

                // Cek perubahan title
                $oldTitle = $old['songtitle'] ?? null;
                $oldListeners = $old['currentlisteners'] ?? null;
                $newTitle = $new['songtitle'] ?? null;
                $newListeners = $new['uniquelisteners'] ?? null;
                $titleChanged = ($oldTitle !== $newTitle);
                $listenersChanged = ($oldListeners !== $newListeners);
                $titleNow = Str::contains(Str::upper($newTitle ?? ''), ['LIVE', 'ONAIR']);
                $newStatus = $titleNow ? 'live' : 'record';

                // Update hanya jika status berubah
                if ($channel->status->value !== $newStatus) {
                    $channel->update(['status' => $newStatus]);
                    Log::info("Update status channel {$channel->name} dari {$channel->status->value} ke {$newStatus}");
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

                if ($titleChanged || $listenersChanged) {
                    event(new RadioUpdate(ChannelResource::make($dataSource)->resolve()));
                    Log::info("Perubahan data  pada channel: {$channel->name} - Title: {$newTitle}, Listeners: {$newListeners}");
                } else {
                    Log::info("Tidak ada perubahan data pada channel: {$channel->name}");
                }
            });

        return 0;
    }
}
