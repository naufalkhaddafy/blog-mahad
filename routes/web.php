<?php


use App\Http\Controllers\BannerController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RadioController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

// route::get('/test-n8n', function () {

//     Http::post(env('N8N_WEBHOOK_URL'), [
//         'channel' => "Radio Islam Sangatta",
//         'description' => 'Al Ustadz Abu Nasim Mukhtar Hafidazahullah - Di Tepi Shubuh Merangkai Doa Harap Nyata Sesi 3',
//     ]);
//     // dd(env('N8N_WEBHOOK_URL'));
//     dd(str_ireplace(['live', 'onair'], '', $newTitle));
// })->name('index');

Route::get('/', [BlogController::class, 'home'])->name('home');
Route::get('/belajar-islam', [BlogController::class, 'list'])->name('blog.list');
Route::get('/sitemap.xml', [SitemapController::class, 'generate']);
Route::get('/radio-online', [RadioController::class, 'index']);
Route::get('/al-quran', [BlogController::class, 'quran'])->name('quran');
Route::get('/api/search', [BlogController::class, 'search'])->name('api.search');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('category', CategoryController::class)->except('show', 'edit', 'create');
    Route::resource('posts', PostController::class);
    Route::resource('tag', TagController::class)->except('show', 'edit', 'create');
    Route::resource('banner', BannerController::class)->except('show', 'edit', 'create');
    Route::post('/banner/reorder', [BannerController::class, 'reorder'])->name('banner.reorder');
    Route::resource('users', UserController::class)->except('create', 'show', 'edit');
    Route::resource('channels', ChannelController::class)->except('create', 'show', 'edit');
    Route::post('/channels/change-status', [ChannelController::class, 'status'])->name('channel.change.status');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::get('/{post:slug}', [BlogController::class, 'show'])->name('blog.show');
