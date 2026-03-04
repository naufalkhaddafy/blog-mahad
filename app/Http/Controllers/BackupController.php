<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use ZipArchive;

class BackupController extends Controller
{
    /**
     * Display backup management page with list of existing backups.
     */
    public function index()
    {
        $backups = $this->getBackupList();

        return Inertia::render('Backup/Index', [
            'backups' => $backups,
        ]);
    }

    /**
     * Create a new backup (database + images).
     */
    public function createBackup()
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $backupFolder = "backups/backup_{$timestamp}";

        // Ensure backup directory exists
        Storage::makeDirectory($backupFolder);

        $results = [
            'database' => false,
            'images' => false,
        ];

        // 1. Backup Database using mysqldump
        try {
            $dbName = config('database.connections.mysql.database');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbHost = config('database.connections.mysql.host');
            $dbPort = config('database.connections.mysql.port', 3306);

            $sqlFile = storage_path("app/private/{$backupFolder}/database.sql");

            // Build mysqldump command
            $command = sprintf(
                'mysqldump --host=%s --port=%s --user=%s --password=%s %s > %s 2>&1',
                escapeshellarg($dbHost),
                escapeshellarg($dbPort),
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbName),
                escapeshellarg($sqlFile)
            );

            exec($command, $output, $returnVar);

            if ($returnVar === 0 && file_exists($sqlFile) && filesize($sqlFile) > 0) {
                $results['database'] = true;
            }
        } catch (\Exception $e) {
            \Log::error('Database backup failed: ' . $e->getMessage());
        }

        // 2. Backup Images (storage/app/public)
        try {
            $publicPath = storage_path('app/public');
            $zipFile = storage_path("app/private/{$backupFolder}/images.zip");

            if (is_dir($publicPath)) {
                $zip = new ZipArchive();
                if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
                    $this->addDirectoryToZip($zip, $publicPath, 'public');
                    $zip->close();
                    $results['images'] = true;
                }
            }
        } catch (\Exception $e) {
            \Log::error('Images backup failed: ' . $e->getMessage());
        }

        if ($results['database'] || $results['images']) {
            // Write metadata
            $metadata = [
                'created_at' => now()->toIso8601String(),
                'database' => $results['database'],
                'images' => $results['images'],
                'db_name' => config('database.connections.mysql.database'),
            ];
            file_put_contents(
                storage_path("app/private/{$backupFolder}/metadata.json"),
                json_encode($metadata, JSON_PRETTY_PRINT)
            );

            return redirect()->route('backup.index')->with('success', 'Backup berhasil dibuat!');
        }

        // Cleanup if both failed
        Storage::deleteDirectory($backupFolder);

        return redirect()->route('backup.index')->with('error', 'Backup gagal. Periksa konfigurasi server.');
    }

    /**
     * Download a backup file.
     */
    public function download(string $folder, string $type)
    {
        $allowedTypes = ['database' => 'database.sql', 'images' => 'images.zip'];

        if (!isset($allowedTypes[$type])) {
            abort(404);
        }

        $filePath = storage_path("app/private/backups/{$folder}/{$allowedTypes[$type]}");

        if (!file_exists($filePath)) {
            abort(404);
        }

        $downloadName = "{$folder}_{$allowedTypes[$type]}";

        return response()->download($filePath, $downloadName);
    }

    /**
     * Restore database from uploaded SQL file.
     */
    public function restoreDatabase(Request $request)
    {
        $request->validate([
            'sql_file' => 'required|file|max:512000', // max 500MB
        ]);

        try {
            $file = $request->file('sql_file');
            $tempPath = $file->storeAs('temp', 'restore_' . time() . '.sql', 'local');
            $sqlFilePath = storage_path("app/private/{$tempPath}");

            $dbName = config('database.connections.mysql.database');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbHost = config('database.connections.mysql.host');
            $dbPort = config('database.connections.mysql.port', 3306);

            $command = sprintf(
                'mysql --host=%s --port=%s --user=%s --password=%s %s < %s 2>&1',
                escapeshellarg($dbHost),
                escapeshellarg($dbPort),
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbName),
                escapeshellarg($sqlFilePath)
            );

            exec($command, $output, $returnVar);

            // Cleanup temp file
            Storage::delete($tempPath);

            if ($returnVar === 0) {
                return redirect()->route('backup.index')->with('success', 'Database berhasil di-restore!');
            }

            return redirect()->route('backup.index')->with('error', 'Restore database gagal: ' . implode("\n", $output));
        } catch (\Exception $e) {
            return redirect()->route('backup.index')->with('error', 'Restore database gagal: ' . $e->getMessage());
        }
    }

    /**
     * Restore images from uploaded ZIP file.
     */
    public function restoreImages(Request $request)
    {
        $request->validate([
            'zip_file' => 'required|file|mimes:zip|max:512000', // max 500MB
        ]);

        try {
            $file = $request->file('zip_file');
            $tempPath = $file->storeAs('temp', 'restore_images_' . time() . '.zip', 'local');
            $zipFilePath = storage_path("app/private/{$tempPath}");

            $zip = new ZipArchive();
            if ($zip->open($zipFilePath) === true) {
                $extractPath = storage_path('app');
                $zip->extractTo($extractPath);
                $zip->close();

                // Cleanup temp file
                Storage::delete($tempPath);

                return redirect()->route('backup.index')->with('success', 'Images berhasil di-restore!');
            }

            Storage::delete($tempPath);
            return redirect()->route('backup.index')->with('error', 'Gagal membuka file ZIP.');
        } catch (\Exception $e) {
            return redirect()->route('backup.index')->with('error', 'Restore images gagal: ' . $e->getMessage());
        }
    }

    /**
     * Delete a backup folder.
     */
    public function delete(string $folder)
    {
        $backupPath = "backups/{$folder}";
        $fullPath = storage_path("app/private/{$backupPath}");

        if (!is_dir($fullPath)) {
            return redirect()->route('backup.index')->with('error', 'Backup tidak ditemukan.');
        }

        // Delete all files in the folder
        $files = glob($fullPath . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        rmdir($fullPath);

        return redirect()->route('backup.index')->with('success', 'Backup berhasil dihapus!');
    }

    /**
     * Get list of existing backups with metadata.
     */
    private function getBackupList(): array
    {
        $backupsPath = storage_path('app/private/backups');

        if (!is_dir($backupsPath)) {
            return [];
        }

        $folders = array_filter(glob($backupsPath . '/*'), 'is_dir');
        $backups = [];

        foreach ($folders as $folder) {
            $folderName = basename($folder);
            $metadataFile = $folder . '/metadata.json';

            $metadata = [];
            if (file_exists($metadataFile)) {
                $metadata = json_decode(file_get_contents($metadataFile), true) ?? [];
            }

            $dbFile = $folder . '/database.sql';
            $imgFile = $folder . '/images.zip';

            $backups[] = [
                'folder' => $folderName,
                'created_at' => $metadata['created_at'] ?? null,
                'has_database' => file_exists($dbFile),
                'has_images' => file_exists($imgFile),
                'database_size' => file_exists($dbFile) ? filesize($dbFile) : 0,
                'images_size' => file_exists($imgFile) ? filesize($imgFile) : 0,
                'db_name' => $metadata['db_name'] ?? '-',
            ];
        }

        // Sort by newest first
        usort($backups, fn($a, $b) => strcmp($b['folder'], $a['folder']));

        return $backups;
    }

    /**
     * Recursively add directory contents to a ZipArchive.
     */
    private function addDirectoryToZip(ZipArchive $zip, string $dirPath, string $zipPath): void
    {
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dirPath, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($files as $file) {
            $filePath = $file->getRealPath();
            $relativePath = $zipPath . '/' . substr($filePath, strlen($dirPath) + 1);

            if ($file->isDir()) {
                $zip->addEmptyDir($relativePath);
            } else {
                $zip->addFile($filePath, $relativePath);
            }
        }
    }
}
