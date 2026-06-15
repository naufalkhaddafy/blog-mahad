<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote');
Schedule::call(function () {
    $channels = \App\Models\Channel::whereNotIn('status', [\App\Enums\ChannelStatus::Unactive])->get();
    foreach ($channels as $channel) {
        \App\Jobs\ProcessChannelStatsJob::dispatch($channel);
    }
})->everyMinute()->name('shoutcast:compare');
