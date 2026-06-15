<?php

namespace App\Http\Controllers;

use App\Models\Recording;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RecordingController extends Controller
{
    public function index()
    {
        $recordings = Recording::with('channel')->orderBy('created_at', 'desc')->paginate(10);
        $channels = \App\Models\Channel::all();
        return Inertia('Recordings/Index', [
            'recordings' => $recordings,
            'channels' => $channels,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'channel_id' => 'nullable|exists:channels,id',
            'audio' => 'required|mimes:mp3,wav,aac,ogg|max:512000', // max 500MB
            'is_published' => 'boolean',
        ]);

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
