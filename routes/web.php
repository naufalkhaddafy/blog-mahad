<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use App\Models\Post;
use GuzzleHttp\Promise\Create;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return inertia('dashboard', [
            'posts' => count(Post::all()),
        ]);
    })->name('dashboard');

    Route::resource('category', CategoryController::class)->except('show', 'edit', 'create');
    Route::resource('posts', PostController::class);
    Route::resource('tag', TagController::class)->except('show', 'edit', 'create');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
