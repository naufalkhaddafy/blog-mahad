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
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Posts/Index', [
            'posts' => PostResource::collection(Post::with('tags', 'category', 'user')->latest()->get()),
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
}
