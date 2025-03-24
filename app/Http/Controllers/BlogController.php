<?php

namespace App\Http\Controllers;

use App\Http\Resources\BannerResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\TagListResource;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function PHPUnit\Framework\isNull;

class BlogController extends Controller
{
    public function home()
    {
        $articleCategory = Category::where('name', 'Artikel')->first();
        $qnaCategory = Category::where('name', 'Tanya Jawab')->first();
        $posterCategory = Category::where('name', 'Poster')->first();

        $post = Post::query()->with('user', 'category', 'tags')
            ->when($articleCategory, fn($q) => $q->where('category_id', $articleCategory->id))
            ->where('status', 'publish')
            ->latest()->take(4)->cursor();

        $qna = Post::query()->with('user', 'category', 'tags')
            ->when($qnaCategory, fn($q) => $q->where('category_id', $qnaCategory->id))
            ->where('status', 'publish')
            ->latest()->take(4)->cursor();

        $poster = Post::query()->with('user', 'category', 'tags')
            ->when($posterCategory, fn($q) => $q->where('category_id', $posterCategory->id))
            ->where('status', 'publish')
            ->latest()->take(10)->cursor();

        return Inertia('Blogs/Home/Index', [
            'posts' => PostResource::collection($post),
            'qna' => PostResource::collection($qna),
            'poster' => PostResource::collection($poster),
            "banner" => BannerResource::collection(Banner::query()->where('status', true)->orderBy('order')->get())
        ]);
    }

    public function show(Post $post)
    {
        $post->increment('views');

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
            'previousPost' => $previousPost ? PostResource::make($previousPost) : null,
            'nextPost' => $nextPost ? PostResource::make($nextPost) : null,
            'relevantPosts' => $relevantPosts->isNotEmpty() ? PostResource::collection($relevantPosts) : [],
        ]);
    }


    public function list(Request $request)
    {
        $filters = $request->only(['search', 'sorting', 'category', 'tags']);

        $posts = Post::where('status', 'publish')
            ->with(['user', 'category', 'tags'])
            ->when($filters['search'] ?? null, fn($q, $search) => $q->where('title', 'like', "%$search%"))
            ->when($filters['category'] ?? null, fn($q, $category) => $q->where('category_id', $category))
            ->when($filters['sorting'] ?? null, fn($q, $sorting) => $sorting === 'popular' ? $q->orderBy('views', 'desc') : $q->orderBy('created_at', $sorting))
            ->when(!empty($filters['tags'] ?? null), fn($q) => $q->whereHas('tags', fn($q) => $q->whereIn('tags.id', explode(',', $filters['tags']))))
            ->latest()
            ->paginate(10)
            ->appends($filters);

        return Inertia('Blogs/Posts/List', [
            'posts' => PostResource::collection($posts),
            'categories' => Category::all(),
            'tags' => TagListResource::collection(Tag::all()),
        ]);
    }
}
