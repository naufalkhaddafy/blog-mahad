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
    public function index()
    {
        $fixedDate = Carbon::parse('2026-02-22');

        return response()
            ->view('sitemap-index', [
                'latestUpdate' => $fixedDate
            ])
            ->header('Content-Type', 'text/xml');
    }

    public function pages()
    {
        // Fixed date to today to ensure stability for Google crawler
        $fixedDate = Carbon::parse('2026-02-22');

        return response()
            ->view('sitemap-pages', compact('fixedDate'))
            ->header('Content-Type', 'text/xml');
    }

    public function posts()
    {
        $posts = Post::query()
            ->select('title', 'slug', 'updated_at', 'image', 'views')
            ->orderBy('updated_at', 'desc')
            ->get();
        
        return response()
            ->view('sitemap-posts', compact('posts'))
            ->header('Content-Type', 'text/xml');
    }
}
