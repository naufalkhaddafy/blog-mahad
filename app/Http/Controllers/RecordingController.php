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

        $perPage = $request->input('per_page', 10);
        $recordings = $query->paginate($perPage)->withQueryString();
        $channels = \App\Models\Channel::all();
        
        return Inertia('Recordings/Index', [
            'recordings' => $recordings,
            'channels' => $channels,
            'filters' => [
                'search' => $request->search,
                'is_published' => $request->is_published,
                'date' => $request->date,
                'per_page' => $perPage,
            ],
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

    public function stream(Recording $recording)
    {
        $path = storage_path('app/public/' . $recording->file_path);

        if (!file_exists($path)) {
            abort(404, 'Audio file not found.');
        }

        return response()->file($path);
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

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:recordings,id'
        ]);

        $recordings = Recording::whereIn('id', $request->ids)->get();

        foreach ($recordings as $recording) {
            if ($recording->file_path && Storage::disk('public')->exists($recording->file_path)) {
                Storage::disk('public')->delete($recording->file_path);
            }
            $recording->delete();
        }

        flashMessage('Success', 'Berhasil menghapus rekaman terpilih.');

        return back();
    }

    public function trim(Request $request, Recording $recording)
    {
        $request->validate([
            'start_time' => 'required|string',
            'end_time' => 'required|string',
        ]);

        if (!$recording->file_path || !Storage::disk('public')->exists($recording->file_path)) {
            return back()->withErrors(['message' => 'File rekaman asli tidak ditemukan.']);
        }

        $originalPath = Storage::disk('public')->path($recording->file_path);
        $extension = pathinfo($originalPath, PATHINFO_EXTENSION);
        if (empty($extension)) {
            $extension = 'mp3';
        }

        $tempFileName = 'recordings/' . uniqid('trimmed_') . '.' . $extension;
        $tempPath = Storage::disk('public')->path($tempFileName);

        $start = escapeshellarg($request->start_time);
        $end = escapeshellarg($request->end_time);
        $input = escapeshellarg($originalPath);
        $output = escapeshellarg($tempPath);

        // Run ffmpeg with stream copy for fast trimming
        $command = "ffmpeg -i {$input} -ss {$start} -to {$end} -c copy {$output} 2>&1";
        
        exec($command, $outputLog, $returnCode);

        if ($returnCode !== 0) {
            \Illuminate\Support\Facades\Log::error('FFMPEG Trim failed: ' . implode("\n", $outputLog));
            return back()->withErrors(['message' => 'Gagal memotong audio. Pastikan format waktu benar (HH:MM:SS) dan ffmpeg terinstall.']);
        }

        if (file_exists($tempPath)) {
            // Replace old file with new file
            rename($tempPath, $originalPath);
            
            // Update database with new file size
            $recording->update([
                'file_size' => filesize($originalPath),
            ]);
            
            flashMessage('Success', 'Berhasil memotong rekaman audio.');
        } else {
            return back()->withErrors(['message' => 'File hasil potongan tidak ditemukan.']);
        }

        return back();
    }

    public function stop(Recording $recording)
    {
        if ($recording->status !== 'recording') {
            return back()->withErrors(['message' => 'Rekaman ini tidak sedang berjalan.']);
        }

        if ($recording->ffmpeg_pid) {
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                exec("taskkill /F /PID " . escapeshellarg($recording->ffmpeg_pid) . " >NUL 2>&1");
            } else {
                exec("kill -15 " . escapeshellarg($recording->ffmpeg_pid) . " >/dev/null 2>&1");
            }
        }
        
        $absolutePath = storage_path('app/public/' . $recording->file_path);
        $size = file_exists($absolutePath) ? filesize($absolutePath) : 0;

        $recording->update([
            'status' => 'completed',
            'file_size' => $size,
        ]);

        \Illuminate\Support\Facades\Log::info("Manually stopped recording {$recording->id}. File size: {$size} bytes");

        flashMessage('Success', 'Berhasil menghentikan rekaman secara manual.');

        return back();
    }
}
