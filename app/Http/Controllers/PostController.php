<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Models\Post;
use App\Http\Requests\PostRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostSingleResource;
use App\Http\Resources\TagListResource;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Post::with(['tags', 'category', 'user'])->latest();

        if ($request->filled('status')) {
            $query->where('status', '=', $request->status);
        }

        if ($request->filled('user')) {
            $query->where('user_id', $request->user);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $perPage = $request->integer('per_page', 10);
        if ($perPage <= 0) $perPage = 10;

        $posts = $query->paginate($perPage)->withQueryString();

        return inertia('Posts/Index', [
            'posts' => PostResource::collection($posts),
            'filters' => $request->only(['status', 'date_from', 'date_to', 'per_page', 'user']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Posts/Form', [
            'posts' => new Post,
            'page_settings' => [
                'title' => 'Tambah Postingan',
                'description' => 'Menambahkan postingan blog baru',
                'url' => route('posts.store'),
                'method' => 'POST',
            ],
            'categories' => Category::query()->select('id', 'name')->get(),
            'tags' => TagListResource::collection(Tag::all()),
            'status' => PostStatus::cases(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {
        $filename = $request->file('image') ? str()->slug($request->title) . '.' . $request->file('image')->getClientOriginalExtension() : $request->image;

        $post = $request->user()->posts()->create([
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'image' => $request->image ? $request->file('image')->storeAs('images/posts', $filename, 'public') : null,
            'status' => $request->status,
        ]);

        $post->tags()->attach($request->tags);

        flashMessage('Success', 'Berhasil menambahkan postingan baru');

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return inertia('Posts/Form', [
            'posts' => PostSingleResource::make($post->load('tags', 'category')),
            'page_settings' => [
                'title' => 'Edit Postingan',
                'description' => 'Mengubah postingan blog',
                'url' => route('posts.update', $post),
                'method' => 'PATCH',
            ],
            'categories' => Category::query()->select('id', 'name')->get(),
            'tags' => TagListResource::collection(Tag::all()),
            'status' => PostStatus::cases(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostRequest $request, Post $post)
    {

        if (($request->hasFile('image') || $request->image === null) && !empty($post->image) && Storage::disk('public')->exists($post->image)) {
            Storage::disk('public')->delete($post->image);
        }

        $filename = $request->file('image') ? str()->slug($request->title) . '.' . $request->file('image')->getClientOriginalExtension() : $request->image;

        $post->update([
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'image' => $request->file('image') ? $request->file('image')->storeAs('images/posts', $filename, 'public') : $request->image,
            'status' => $request->status,
        ]);

        $post->tags()->sync($request->tags);

        flashMessage('Success', 'Berhasil mengubah postingan blog');

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // if (!empty($post->image) && Storage::disk('public')->exists($post->image)) {
        //     Storage::disk('public')->delete($post->image);
        // }

        $post->delete();

        flashMessage('success', 'Berhasil menghapus postingan ' . $post->title);
        return back();
    }

    /**
     * Auto-save post as draft.
     */
    public function autosave(Request $request, ?Post $post = null)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description ?? '',
            'category_id' => $request->category_id ?: null,
            'status' => PostStatus::DRAFT,
        ];

        if ($post) {
            $post->update($data);
            if ($request->filled('tags')) {
                $post->tags()->sync($request->tags);
            }
        } else {
            $post = $request->user()->posts()->create($data);
            if ($request->filled('tags')) {
                $post->tags()->attach($request->tags);
            }
        }

        return response()->json([
            'id' => $post->id,
            'saved_at' => now()->format('H:i'),
            'url' => route('posts.update', $post),
        ]);
    }
}
