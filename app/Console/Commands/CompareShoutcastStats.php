<?php

namespace App\Console\Commands;

use App\Enums\ChannelStatus;
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
                $old = $cached ? json_decode($cached, true) : null;

                $resp = Http::get($channel->url . '/stats?sid=1&json=1');
                if (!$resp->successful()) return;
                $new = $resp->json();
                if (!$new) {
                    Log::error("Failed to fetch data for channel: {$channel->name}");
                    return;
                }
                $dataSource = [
                    ...$channel->toArray(),
                    'currentlisteners' => $new['currentlisteners'] ?? 0,
                    'servertitle' => $new['servertitle'] ?? null,
                    'songtitle' => $new['songtitle'] ?? null,
                ];

                if ($old['songtitle'] !== $new['songtitle']) {
                    Redis::set($key, json_encode($dataSource));
                    $titleNow =  Str::contains(Str::upper($new['songtitle'] ?? ''), ['LIVE', 'ONAIR']);
                    if ($channel->status === ChannelStatus::Unactive) {
                        return;
                    } elseif ($titleNow) {
                        $channel->update(['status' => ChannelStatus::Live]);
                    } else {
                        $channel->update(['status' => ChannelStatus::Record]);
                    }
                    Log::info(
                        'Perubahan data pada channel'
                    );
                } else {
                    Redis::set($key, json_encode($dataSource));
                    $titleNow =  Str::contains(Str::upper($new['songtitle'] ?? ''), ['LIVE', 'ONAIR']);
                    if ($channel->status === ChannelStatus::Unactive) {
                        return;
                    } elseif ($titleNow) {
                        $channel->update(['status' => ChannelStatus::Live]);
                    } else {
                        $channel->update(['status' => ChannelStatus::Record]);
                    }
                    Log::info(
                        'Tidak ada perubahan data pada channel'
                    );
                }
            });

        return 0;
    }
}
