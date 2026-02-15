<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote');
Schedule::command('shoutcast:compare')
    ->everyMinute()
    ->runInBackground()
    ->onSuccess(function () {
        Log::info("Command berhasil jalan!");
    })
    ->onFailure(function () {
        Log::error("Command gagal jalan!");
    });
