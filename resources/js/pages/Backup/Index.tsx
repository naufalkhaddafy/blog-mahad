import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    Database,
    DatabaseBackup,
    Download,
    HardDriveUpload,
    Image,
    Loader2,
    Plus,
    RefreshCw,
    ShieldAlert,
    Trash2,
    Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Backup & Restore', href: '/backup' },
];

interface BackupItem {
    folder: string;
    created_at: string | null;
    has_database: boolean;
    has_images: boolean;
    database_size: number;
    images_size: number;
    db_name: string;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

export default function BackupIndex({ backups }: { backups: BackupItem[] }) {
    const [creating, setCreating] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Restore states
    const [restoreDbOpen, setRestoreDbOpen] = useState(false);
    const [restoreImgOpen, setRestoreImgOpen] = useState(false);
    const [restoringDb, setRestoringDb] = useState(false);
    const [restoringImg, setRestoringImg] = useState(false);

    const dbFileRef = useRef<HTMLInputElement>(null);
    const imgFileRef = useRef<HTMLInputElement>(null);

    const [dbFile, setDbFile] = useState<File | null>(null);
    const [imgFile, setImgFile] = useState<File | null>(null);

    const handleCreateBackup = () => {
        setCreating(true);
        router.post(route('backup.create'), {}, {
            onSuccess: () => {
                toast.success('Backup berhasil dibuat!');
            },
            onError: () => {
                toast.error('Gagal membuat backup.');
            },
            onFinish: () => setCreating(false),
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(route('backup.delete', deleteTarget), {
            onSuccess: () => {
                toast.success('Backup berhasil dihapus!');
                setDeleteTarget(null);
            },
            onError: () => toast.error('Gagal menghapus backup.'),
            onFinish: () => setDeleting(false),
        });
    };

    const handleRestoreDb = () => {
        if (!dbFile) return;
        setRestoringDb(true);
        const formData = new FormData();
        formData.append('sql_file', dbFile);
        router.post(route('backup.restore-database'), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Database berhasil di-restore!');
                setRestoreDbOpen(false);
                setDbFile(null);
                if (dbFileRef.current) dbFileRef.current.value = '';
            },
            onError: () => toast.error('Gagal restore database.'),
            onFinish: () => setRestoringDb(false),
        });
    };

    const handleRestoreImg = () => {
        if (!imgFile) return;
        setRestoringImg(true);
        const formData = new FormData();
        formData.append('zip_file', imgFile);
        router.post(route('backup.restore-images'), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Images berhasil di-restore!');
                setRestoreImgOpen(false);
                setImgFile(null);
                if (imgFileRef.current) imgFileRef.current.value = '';
            },
            onError: () => toast.error('Gagal restore images.'),
            onFinish: () => setRestoringImg(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Backup & Restore" />

            <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-10">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 p-6 text-white shadow-2xl sm:p-8 lg:p-10">
                    <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                                    <DatabaseBackup className="size-7" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Backup & Restore</h1>
                            </div>
                            <p className="max-w-xl text-emerald-200/80">
                                Kelola backup database dan gambar. Buat backup baru, download, atau restore dari file backup sebelumnya.
                            </p>
                        </div>
                        <Button
                            onClick={handleCreateBackup}
                            disabled={creating}
                            className="shrink-0 cursor-pointer gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-900 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl disabled:opacity-70"
                            size="lg"
                        >
                            {creating ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Membuat Backup...
                                </>
                            ) : (
                                <>
                                    <Plus className="size-4" />
                                    Buat Backup Baru
                                </>
                            )}
                        </Button>
                    </div>
                    {/* Decorative */}
                    <div className="absolute -top-20 -right-20 size-72 rounded-full bg-teal-400/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-emerald-400/10 blur-3xl" />
                </div>

                {/* Backup List */}
                <div className="space-y-4">
                    <Heading title="Daftar Backup" description={`${backups.length} backup tersedia`} />

                    {backups.length > 0 ? (
                        <Card className="overflow-hidden border-none shadow-lg">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                                            <TableHead className="font-semibold">Nama Backup</TableHead>
                                            <TableHead className="font-semibold">Tanggal</TableHead>
                                            <TableHead className="font-semibold">Database</TableHead>
                                            <TableHead className="font-semibold">Images</TableHead>
                                            <TableHead className="text-right font-semibold">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {backups.map((backup) => (
                                            <TableRow key={backup.folder} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 text-white shadow-md">
                                                            <Archive className="size-3.5" />
                                                        </div>
                                                        <span className="font-medium text-sm">{backup.folder}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(backup.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    {backup.has_database ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Database className="size-3.5 text-blue-500" />
                                                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                                {formatFileSize(backup.database_size)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {backup.has_images ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Image className="size-3.5 text-purple-500" />
                                                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                                                {formatFileSize(backup.images_size)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-1">
                                                        {backup.has_database && (
                                                            <a
                                                                href={route('backup.download', { folder: backup.folder, type: 'database' })}
                                                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
                                                            >
                                                                <Download className="size-3" />
                                                                SQL
                                                            </a>
                                                        )}
                                                        {backup.has_images && (
                                                            <a
                                                                href={route('backup.download', { folder: backup.folder, type: 'images' })}
                                                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-purple-600 transition-colors hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30"
                                                            >
                                                                <Download className="size-3" />
                                                                ZIP
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => setDeleteTarget(backup.folder)}
                                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                                        >
                                                            <Trash2 className="size-3" />
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                                    <DatabaseBackup className="size-10 text-muted-foreground opacity-40" />
                                </div>
                                <p className="mt-4 text-sm font-medium text-muted-foreground">Belum ada backup.</p>
                                <p className="text-xs text-muted-foreground">Klik tombol "Buat Backup Baru" untuk memulai.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Restore Section */}
                <div className="space-y-4">
                    <Heading title="Restore dari File" description="Upload file backup untuk mengembalikan data" />
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Restore Database */}
                        <Card className="group relative overflow-hidden border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 transition-opacity group-hover:from-blue-500/10 group-hover:to-indigo-500/10" />
                            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 text-white shadow-lg transition-transform group-hover:scale-110">
                                    <Database className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">Restore Database</CardTitle>
                                    <p className="text-xs text-muted-foreground">Upload file .sql untuk restore</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Mengembalikan database dari file SQL backup. Data yang ada saat ini akan ditimpa.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer gap-2 border-blue-200 text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                                    onClick={() => setRestoreDbOpen(true)}
                                >
                                    <HardDriveUpload className="size-4" />
                                    Upload File SQL
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Restore Images */}
                        <Card className="group relative overflow-hidden border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 transition-opacity group-hover:from-purple-500/10 group-hover:to-pink-500/10" />
                            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 text-white shadow-lg transition-transform group-hover:scale-110">
                                    <Image className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">Restore Images</CardTitle>
                                    <p className="text-xs text-muted-foreground">Upload file .zip untuk restore</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Mengembalikan gambar/media dari file ZIP backup. File yang ada akan ditimpa.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer gap-2 border-purple-200 text-purple-700 transition-colors hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/30"
                                    onClick={() => setRestoreImgOpen(true)}
                                >
                                    <HardDriveUpload className="size-4" />
                                    Upload File ZIP
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <Trash2 className="size-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">Hapus Backup</DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menghapus backup <strong>{deleteTarget}</strong>?
                            <br />
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-center">
                        <Button variant="outline" onClick={() => setDeleteTarget(null)} className="cursor-pointer">
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="cursor-pointer gap-2"
                        >
                            {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Restore Database Dialog */}
            <Dialog open={restoreDbOpen} onOpenChange={setRestoreDbOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <AlertTriangle className="size-6 text-amber-600" />
                        </div>
                        <DialogTitle className="text-center">Restore Database</DialogTitle>
                        <DialogDescription className="text-center">
                            <span className="font-semibold text-red-600">Peringatan:</span> Proses ini akan menimpa seluruh database yang ada saat ini.
                            Pastikan Anda sudah membuat backup terlebih dahulu.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-6 text-center transition-colors dark:border-blue-800 dark:bg-blue-950/20">
                            <input
                                ref={dbFileRef}
                                type="file"
                                accept=".sql"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setDbFile(file);
                                }}
                            />
                            {dbFile ? (
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <Database className="size-5 text-blue-500" />
                                    <span className="font-medium">{dbFile.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({formatFileSize(dbFile.size)})
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => dbFileRef.current?.click()}
                                    className="cursor-pointer space-y-2"
                                >
                                    <Upload className="mx-auto size-8 text-blue-400" />
                                    <p className="text-sm text-muted-foreground">
                                        Klik untuk memilih file <strong>.sql</strong>
                                    </p>
                                </button>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:justify-center">
                        <Button variant="outline" onClick={() => { setRestoreDbOpen(false); setDbFile(null); if (dbFileRef.current) dbFileRef.current.value = ''; }} className="cursor-pointer">
                            Batal
                        </Button>
                        <Button
                            onClick={handleRestoreDb}
                            disabled={!dbFile || restoringDb}
                            className="cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                            {restoringDb ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                            Restore Database
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Restore Images Dialog */}
            <Dialog open={restoreImgOpen} onOpenChange={setRestoreImgOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <ShieldAlert className="size-6 text-amber-600" />
                        </div>
                        <DialogTitle className="text-center">Restore Images</DialogTitle>
                        <DialogDescription className="text-center">
                            <span className="font-semibold text-red-600">Peringatan:</span> File gambar yang ada saat ini mungkin akan ditimpa oleh file dari backup.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-6 text-center transition-colors dark:border-purple-800 dark:bg-purple-950/20">
                            <input
                                ref={imgFileRef}
                                type="file"
                                accept=".zip"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setImgFile(file);
                                }}
                            />
                            {imgFile ? (
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <Image className="size-5 text-purple-500" />
                                    <span className="font-medium">{imgFile.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({formatFileSize(imgFile.size)})
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => imgFileRef.current?.click()}
                                    className="cursor-pointer space-y-2"
                                >
                                    <Upload className="mx-auto size-8 text-purple-400" />
                                    <p className="text-sm text-muted-foreground">
                                        Klik untuk memilih file <strong>.zip</strong>
                                    </p>
                                </button>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:justify-center">
                        <Button variant="outline" onClick={() => { setRestoreImgOpen(false); setImgFile(null); if (imgFileRef.current) imgFileRef.current.value = ''; }} className="cursor-pointer">
                            Batal
                        </Button>
                        <Button
                            onClick={handleRestoreImg}
                            disabled={!imgFile || restoringImg}
                            className="cursor-pointer gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                            {restoringImg ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                            Restore Images
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
