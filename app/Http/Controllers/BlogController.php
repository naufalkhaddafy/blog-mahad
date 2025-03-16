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
        $artticleCategory = Category::where('name', 'Artikel')->first();
        $qnaCategory = Category::where('name', 'Tanya Jawab')->first();
        $posterCategory = Category::where('name', 'Poster')->first();
        $post = Post::query()->with('user', 'category', 'tags')->where('category_id', $artticleCategory->id)->where('status', 'publish')->latest()->take(4)->cursor();
        $qna = Post::query()->with('user', 'category', 'tags')->where('category_id', $qnaCategory->id)->where('status', 'publish')->latest()->take(4)->cursor();
        $poster = Post::query()->with('user', 'category', 'tags')->where('category_id', $posterCategory->id)->where('status', 'publish')->latest()->take(4)->cursor();;
        return Inertia('Blogs/Home/Index', [
            'posts' => PostResource::collection($post),
            'qna' => PostResource::collection($qna),
            'poster' => PostResource::collection($poster),
        ]);
    }

    public function show($category, Post $post)
    {
        // dd($post);

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

        // dd($relevantPosts);

        return Inertia('Blogs/Posts/Show', [
            'post' => PostResource::make($post->load('user', 'category', 'tags')),
            'previousPost' => $previousPost ? PostResource::make($previousPost) : null,
            'nextPost' => $nextPost ? PostResource::make($nextPost) : null,
            'relevantPosts' => $relevantPosts->isNotEmpty() ? PostResource::collection($relevantPosts) : [],
        ]);
    }
}
