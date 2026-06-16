import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
// @ts-ignore
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { MoreHorizontal, Disc } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rekaman Audio',
        href: '/recordings',
    },
];

const Index = ({ recordings, channels = [], filters = {} }: { recordings: any; channels?: any[]; filters?: any }) => {
    const { errors } = usePage().props;
    const items = recordings?.data || [];
    const paginationData = recordings;

    const [selectEdit, setSelectEdit] = useState<any | null>(null);
    const [showUpload, setShowUpload] = useState(false);

    const [filterSearch, setFilterSearch] = useState(filters?.search || '');
    const [filterPublished, setFilterPublished] = useState(filters?.is_published || '');
    const [filterDate, setFilterDate] = useState(filters?.date || '');

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get('/recordings', {
                search: filterSearch,
                is_published: filterPublished,
                date: filterDate,
            }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);

        return () => clearTimeout(timeout);
    }, [filterSearch, filterPublished, filterDate]);

    const clearFilters = () => {
        setFilterSearch('');
        setFilterPublished('');
        setFilterDate('');
        router.get('/recordings');
    };

    const { data, setData, reset, processing } = useForm<{ title: string; is_published: boolean }>({
        title: '',
        is_published: false,
    });

    const uploadForm = useForm<{ title: string; channel_id: string; is_published: boolean; audio: File | null }>({
        title: '',
        channel_id: '',
        is_published: false,
        audio: null,
    });

    const handleEdit = (rec: any) => {
        setSelectEdit(rec);
        setData({
            title: rec.title || '',
            is_published: !!rec.is_published,
        });
    };

    const handleCancel = () => {
        setSelectEdit(null);
        setShowUpload(false);
        reset();
        uploadForm.reset();
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(route('recordings.update', selectEdit.id), data, {
            onSuccess: () => {
                reset();
                setSelectEdit(null);
            },
        });
    };

    const onUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post(route('recordings.store'), {
            onSuccess: () => {
                uploadForm.reset();
                setShowUpload(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus rekaman ini? File audio juga akan terhapus secara permanen.')) {
            router.delete(route('recordings.destroy', id));
        }
    };

    const handlePublishToggle = (id: number, currentTitle: string, isPublished: boolean) => {
        router.patch(route('recordings.update', id), {
            title: currentTitle,
            is_published: !isPublished,
        });
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekaman Audio" />
            <div className="rounded-xl px-4 py-6">
                <div className="flex items-center justify-between mt-6">
                    <Heading
                        title="Rekaman Siaran Radio"
                        description="Kelola hasil rekaman otomatis dari siaran live radio."
                    />
                    <Button onClick={() => { setShowUpload(true); setSelectEdit(null); }}>
                        Upload Audio
                    </Button>
                </div>
                <div className="max-w-5xl mt-6">
                    {showUpload && (
                        <div className="mb-6 rounded-xl border p-4 shadow bg-slate-50">
                            <h3 className="font-bold text-lg mb-4">Upload Rekaman Manual</h3>
                            <form onSubmit={onUploadSubmit}>
                                <div className="grid gap-4">
                                    <div>
                                        <Label htmlFor="channel_id">Channel Radio</Label>
                                        <select
                                            id="channel_id"
                                            className="flex h-10 w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            value={uploadForm.data.channel_id}
                                            onChange={(e) => uploadForm.setData('channel_id', e.target.value)}
                                        >
                                            <option value="">-- Boleh Kosong (Tidak Ada Channel) --</option>
                                            {channels.map((ch) => (
                                                <option key={ch.id} value={ch.id}>{ch.name}</option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={uploadForm.errors.channel_id} />
                                    </div>
                                    <div>
                                        <Label htmlFor="upload_title">Judul Rekaman</Label>
                                        <Input
                                            id="upload_title"
                                            type="text"
                                            className="w-full mt-2"
                                            value={uploadForm.data.title}
                                            onChange={(e) => uploadForm.setData('title', e.target.value)}
                                            placeholder="Masukan judul rekaman"
                                            required
                                        />
                                        <InputError className="mt-2" message={uploadForm.errors.title} />
                                    </div>
                                    <div>
                                        <Label htmlFor="audio">File Audio (MP3/AAC/WAV)</Label>
                                        <Input
                                            id="audio"
                                            type="file"
                                            accept="audio/*"
                                            className="w-full mt-2"
                                            onChange={(e) => uploadForm.setData('audio', e.target.files ? e.target.files[0] : null)}
                                            required
                                        />
                                        <InputError className="mt-2" message={uploadForm.errors.audio} />
                                        {uploadForm.progress && (
                                            <progress value={uploadForm.progress.percentage} max="100" className="mt-2 w-full">
                                                {uploadForm.progress.percentage}%
                                            </progress>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Switch
                                            id="upload_is_published"
                                            checked={uploadForm.data.is_published}
                                            onCheckedChange={(checked: boolean) => uploadForm.setData('is_published', checked)}
                                        />
                                        <Label htmlFor="upload_is_published">Langsung Publish ke Publik</Label>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button type="submit" disabled={uploadForm.processing}>Upload & Simpan</Button>
                                        <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {selectEdit && (
                        <div className="mb-6 rounded-xl border p-4 shadow">
                            <h3 className="font-bold text-lg mb-4">Edit Rekaman</h3>
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-4">
                                    <div>
                                        <Label htmlFor="title">Judul Rekaman</Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            className="w-full mt-2"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Masukan judul rekaman"
                                        />
                                        <InputError className="mt-2" message={errors.title} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Switch
                                            id="is_published"
                                            checked={data.is_published}
                                            onCheckedChange={(checked: boolean) => setData('is_published', checked)}
                                        />
                                        <Label htmlFor="is_published">Publish ke Publik</Label>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                                        <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 mb-4">
                        <Input
                            placeholder="Cari judul rekaman..."
                            className="max-w-xs bg-white"
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                        />
                        <select
                            className="flex h-10 w-full max-w-[200px] rounded-md border border-input bg-white px-3 py-2 text-sm"
                            value={filterPublished}
                            onChange={(e) => setFilterPublished(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="1">Published</option>
                            <option value="0">Draft</option>
                        </select>
                        <Input
                            type="date"
                            className="max-w-[160px] bg-white"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        {(filterSearch !== '' || filterPublished !== '' || filterDate !== '') && (
                            <Button variant="destructive" onClick={clearFilters}>Reset Filter</Button>
                        )}
                    </div>

                    <div className="rounded-md border overflow-x-auto bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Informasi Rekaman</TableHead>
                                    <TableHead>Audio Player</TableHead>
                                    <TableHead className="text-center">Published</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500 h-32">
                                            Belum ada rekaman yang tersedia. Rekaman akan otomatis muncul ketika ada radio yang selesai siaran (Live).
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-center">
                                                <Disc size={20} className={item.status === 'recording' ? 'animate-spin text-red-500 mx-auto' : 'text-gray-400 mx-auto'} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="min-w-48">
                                                    <h3 className="text-sm font-bold text-ellipsis">
                                                        {item.title}
                                                    </h3>
                                                    <div className="py-1 text-xs text-gray-500">
                                                        Channel: <strong>{item.channel?.name || '-'}</strong> &bull; Status: {item.status.toUpperCase()}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">
                                                        {new Date(item.created_at).toLocaleString()} &bull; {formatBytes(item.file_size)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item.status === 'completed' ? (
                                                    <div className="w-full min-w-48">
                                                        <audio controls className="h-9 w-full" preload="none">
                                                            <source src={`/storage/${item.file_path}`} type="audio/mpeg" />
                                                            Browser Anda tidak mendukung audio player.
                                                        </audio>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-400 italic">Sedang merekam...</div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center">
                                                    <Switch
                                                        id={`publish-${item.id}`}
                                                        checked={!!item.is_published}
                                                        onCheckedChange={() => handlePublishToggle(item.id, item.title, !!item.is_published)}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {paginationData && (
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
                            <p className="text-muted-foreground text-sm">
                                Menampilkan {paginationData.from || 0} – {paginationData.to || 0} dari {paginationData.total} data
                            </p>
                            {paginationData.last_page > 1 && (
                                <div className="flex items-center gap-1">
                                    {paginationData.links.map((link: any, idx: number) => {
                                        const isNav = idx === 0 || idx === paginationData.links.length - 1;
                                        const label = link.label
                                            .replace('&laquo;', '«')
                                            .replace('&raquo;', '»')
                                            .replace('Previous', 'Prev');

                                        return (
                                            <Button
                                                key={idx}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                                className={isNav ? 'px-3' : 'px-3'}
                                                dangerouslySetInnerHTML={{ __html: label }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
