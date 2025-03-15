<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function PHPUnit\Framework\isNull;

class BlogController extends Controller
{
    public function home()
    {
        $category = Category::where('name', 'Artikel')->first();
        $post = Post::query()->with('user', 'category', 'tags')->where('category_id', $category->id)->where('status', 'publish')->latest()->take(4)->cursor();
        // dd($post);

        return Inertia('Blogs/Home/Index', [
            'posts' => PostResource::collection($post),
        ]);
    }

    public function show($category, Post $post)
    {

        $previousPost = Post::whereRaw('created_at = (SELECT MAX(created_at) FROM posts WHERE created_at < ? AND category_id = ? AND status = "publish")', [$post->created_at, $post->category_id])
            ->first();

        $nextPost = Post::whereRaw('created_at = (SELECT MIN(created_at) FROM posts WHERE created_at > ? AND category_id = ? AND status = "publish")', [$post->created_at, $post->category_id])
            ->first();

        if (!$previousPost || !$nextPost) {
            $randomPost = Post::where('category_id', $post->category_id)
                ->where('status', 'publish')
                ->where('id', '!=', $post->id)
                ->when($previousPost, fn($query) => $query->where('id', '!=', $previousPost->id))
                ->when($nextPost, fn($query) => $query->where('id', '!=', $nextPost->id))
                ->inRandomOrder()
                ->first();

            if (!$previousPost) {
                $previousPost = $randomPost;
            } elseif (!$nextPost) {
                $nextPost = $randomPost;
            }
        }

        $relevantPosts = Post::where('status', 'publish')
            ->where('id', '!=', $post->id)
            ->where(function ($query) use ($post) {
                $query->where('category_id', $post->category_id)
                    ->orWhereHas('tags', function ($q) use ($post) {
                        $q->whereIn('name', $post->tags->pluck('name'));
                    });
            })
            ->latest()
            ->take(3)
            ->get();


        return Inertia('Blogs/Posts/Show', [
            'post' => PostResource::make($post->load('user', 'category', 'tags')),
            'previousPost' =>  PostResource::make($previousPost),
            'nextPost' =>  PostResource::make($nextPost),
            'relevantPosts' => PostResource::collection($relevantPosts)
        ]);
    }
}
