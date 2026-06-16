<?php

namespace App\Http\Controllers;

use App\Models\Recording;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RecordingController extends Controller
{
    public function index(Request $request)
    {
        $query = Recording::with('channel')->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('is_published')) {
            $query->where('is_published', $request->is_published === 'true' || $request->is_published === '1');
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $recordings = $query->paginate(10)->withQueryString();
        $channels = \App\Models\Channel::all();
        
        return Inertia('Recordings/Index', [
            'recordings' => $recordings,
            'channels' => $channels,
            'filters' => $request->only(['search', 'is_published', 'date']),
        ]);
    }

    public function publicIndex(Request $request)
    {
        $query = Recording::with('channel')
            ->where('is_published', true)
            ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $recordings = $query->get()->map(function ($rec) {
            return [
                'id' => $rec->id,
                'title' => $rec->title,
                'file_path' => $rec->file_path,
                'file_size' => $rec->file_size,
                'created_at' => $rec->created_at->toISOString(),
                'created_at_formatted' => $rec->created_at->translatedFormat('d F Y'),
                'year' => $rec->created_at->format('Y'),
                'channel' => $rec->channel ? ['name' => $rec->channel->name] : null,
            ];
        })->groupBy('year');

        return Inertia('Blogs/AudioKajian/Index', [
            'recordings' => $recordings,
            'search' => $request->search ?? '',
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'channel_id' => 'nullable|exists:channels,id',
                'audio' => 'required|mimes:mp3,wav,aac,ogg|max:512000', // max 500MB
                'is_published' => 'boolean',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation failed: ', $e->errors());
            throw $e;
        }

        $file = $request->file('audio');
        $fileName = \Illuminate\Support\Str::slug($request->title . '-' . now()->format('Y-m-d-H-i-s')) . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('recordings', $fileName, 'public');

        Recording::create([
            'channel_id' => $request->channel_id,
            'title' => $request->title,
            'file_path' => $filePath,
            'file_size' => $file->getSize(),
            'status' => 'completed',
            'is_published' => $request->is_published ?? false,
        ]);

        flashMessage('Success', 'Berhasil mengupload rekaman.');

        return back();
    }

    public function update(Request $request, Recording $recording)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'is_published' => 'required|boolean',
        ]);

        $recording->update([
            'title' => $request->title,
            'is_published' => $request->is_published,
        ]);

        flashMessage('Success', 'Berhasil memperbarui data rekaman.');

        return back();
    }

    public function destroy(Recording $recording)
    {
        if ($recording->file_path && Storage::disk('public')->exists($recording->file_path)) {
            Storage::disk('public')->delete($recording->file_path);
        }

        $recording->delete();

        flashMessage('Success', 'Berhasil menghapus rekaman.');

        return back();
    }
}
