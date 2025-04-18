<?php

namespace App\Http\Controllers;

use App\Http\Resources\BannerResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostSingleResource;
use App\Http\Resources\TagListResource;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


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
            "banner" => BannerResource::collection(Banner::query()->where('status', true)->orderBy('order')->get()),
        ]);
    }

    public function show(Post $post)
    {
        if ($post->status->value !== 'publish') {
            return abort(404, 'Afwan Postingan tidak ditemukan');
        }

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
            'post' => PostSingleResource::make($post->load('user', 'category', 'tags')),
            'previousPost' => $previousPost ? PostResource::make($previousPost) : null,
            'nextPost' => $nextPost ? PostResource::make($nextPost) : null,
            'relevantPosts' => $relevantPosts->isNotEmpty() ? PostResource::collection($relevantPosts) : [],
            'meta' => (object)[
                'title' => $post->title,
                'description' => limitText($post->description, 160),
                'image' => url(Storage::url($post->image)),
                'url' => url()->current(),
                'type' => 'article',
            ],

        ]);
    }


    public function list(Request $request)
    {
        $filters = $request->only(['search', 'sorting', 'category', 'tags']);

        $posts = Post::where('status', 'publish')
            ->with(['user', 'category', 'tags'])
            ->when($filters['search'] ?? null, fn($q, $search) => $q->where('title', 'like', "%$search%"))
            ->when(!empty($filters['category'] ?? null), function ($q) use ($filters) {
                $category = Category::where('slug', $filters['category'])->first();
                return $q->where('category_id', $category->id ?? null);
            })
            ->when($filters['sorting'] ?? null, fn($q, $sorting) => $sorting === 'popular' ? $q->orderBy('views', 'desc') : $q->orderBy('created_at', $sorting))
            ->when(!empty($filters['tags'] ?? null), fn($q) => $q->whereHas('tags', fn($q) => $q->whereIn('tags.slug', explode(',', $filters['tags']))))
            ->latest()
            ->paginate(10)
            ->appends($filters);


        $meta = match ($filters['category'] ?? null) {
            'info-taklim' => (object)[
                'title' => 'Info Taklim',
                'description' => 'Dapatkan informasi Jadwal Kajian Islam Ilmiah di Kota Sangatta disini.'
            ],
            'audio' => (object)[
                'title' => 'Audio',
                'description' => 'Dengarkan dan Download audio kajian dari berbagai tema dan pembicara.',
            ],
            'e-book' => (object)[
                'title' => 'E-Book',
                'description' => 'Download dan baca buku/kitab seputar Islam secara gratis disini.',
            ],
            default => (object)[
                'title' => 'Belajar Islam',
                'description' => 'Kunjungi dan baca artikel seputar dunia Islam disini.',
            ]
        };

        return Inertia('Blogs/Posts/List', [
            'posts' => PostResource::collection($posts),
            'categories' => Category::all(),
            'tags' => TagListResource::collection(Tag::all()),
            'meta' => (object)[
                'title' => $meta->title . ' - Kajian Islam Sangatta',
                'description' => $meta->description,
                'url' => url()->current(),
            ],
        ]);
    }
}
