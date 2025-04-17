<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;

class SitemapController extends Controller
{
    public function generate()
    {
        $posts = Post::query()->select('title', 'slug', 'updated_at', 'image', 'views')->orderBy('views', 'desc')->get();
        
        return response()
            ->view('sitemap', compact('posts'))
            ->header('Content-Type', 'text/xml');
    }
}
