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

Route::middleware([\App\Http\Middleware\TrackPageVisit::class])->group(function () {
    Route::get('/', [BlogController::class, 'home'])->name('home');
    Route::get('/belajar-islam', [BlogController::class, 'list'])->name('blog.list');
    Route::get('/radio-online', [RadioController::class, 'index']);
    Route::get('/al-quran', [BlogController::class, 'quran'])->name('quran');
});

Route::get('/sitemap.xml', [SitemapController::class, 'index']);
Route::get('/sitemap-pages.xml', [SitemapController::class, 'pages']);
Route::get('/sitemap-posts.xml', [SitemapController::class, 'posts']);
Route::get('/api/search', [BlogController::class, 'search'])->name('api.search');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('visitors', [\App\Http\Controllers\MonitoringController::class, 'visitors'])->name('monitoring.visitors');
    Route::get('log', [\App\Http\Controllers\MonitoringController::class, 'logs'])->name('monitoring.logs')->middleware('role:super-admin');
    Route::resource('category', CategoryController::class)->except('show', 'edit', 'create');
    Route::post('/posts/autosave/{post?}', [PostController::class, 'autosave'])->name('posts.autosave');
    Route::resource('posts', PostController::class);
    Route::resource('tag', TagController::class)->except('show', 'edit', 'create');
    Route::resource('banner', BannerController::class)->except('show', 'edit', 'create');
    Route::post('/banner/reorder', [BannerController::class, 'reorder'])->name('banner.reorder');
    Route::resource('users', UserController::class)->except('create', 'show', 'edit')->middleware('role:super-admin');
    Route::post('/users/{user}/toggle-suspend', [UserController::class, 'toggleSuspend'])->name('users.toggle-suspend')->middleware('role:super-admin');
    Route::resource('channels', ChannelController::class)->except('create', 'show', 'edit');
    Route::post('/channels/change-status', [ChannelController::class, 'status'])->name('channel.change.status');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::middleware([\App\Http\Middleware\TrackPageVisit::class])->group(function () {
    Route::get('/{post:slug}', [BlogController::class, 'show'])->name('blog.show');
});
