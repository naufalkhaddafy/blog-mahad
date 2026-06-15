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
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { MoreHorizontal, Disc } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rekaman Audio',
        href: '/recordings',
    },
];

const Index = ({ recordings, channels = [] }: { recordings: any; channels?: any[] }) => {
    const { errors } = usePage().props;
    const items = recordings?.data || [];
    const paginationData = recordings;

    const [selectEdit, setSelectEdit] = useState<any | null>(null);
    const [showUpload, setShowUpload] = useState(false);

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
                                            onCheckedChange={(checked) => uploadForm.setData('is_published', checked)}
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
                                            onCheckedChange={(checked) => setData('is_published', checked)}
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

                    <div className="grid gap-4">
                        {items.map((item: any, index: number) => (
                            <Card
                                key={index}
                                className="custom-scrollbar w-full max-w-screen overflow-x-auto p-2 md:p-4"
                            >
                                <div className="flex items-center gap-4 md:gap-8">
                                    <div className="px-5 hidden md:block">
                                        <Disc size={32} className={item.status === 'recording' ? 'animate-spin text-red-500' : 'text-gray-500'} />
                                    </div>

                                    <div className="w-full min-w-56 px-2">
                                        <h3 className="text-md font-bold text-ellipsis">
                                            {item.title}
                                        </h3>
                                        <div className="py-1 text-sm text-gray-500">
                                            Channel: <strong>{item.channel?.name}</strong> &bull; Status: {item.status.toUpperCase()}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(item.created_at).toLocaleString()} &bull; {formatBytes(item.file_size)}
                                        </div>
                                    </div>

                                    {item.status === 'completed' && (
                                        <div className="w-full px-2">
                                            <audio controls className="h-10 w-full" preload="none">
                                                <source src={`/storage/${item.file_path}`} type="audio/mpeg" />
                                                Browser Anda tidak mendukung audio player.
                                            </audio>
                                        </div>
                                    )}

                                    <div className="mx-8 flex flex-col items-center gap-2 lg:mx-0">
                                        <Label htmlFor={`publish-${item.id}`} className="text-xs">Published</Label>
                                        <Switch
                                            id={`publish-${item.id}`}
                                            checked={!!item.is_published}
                                            onCheckedChange={() => handlePublishToggle(item.id, item.title, !!item.is_published)}
                                        />
                                    </div>

                                    <div className="p-5">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {items.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                Belum ada rekaman yang tersedia. Rekaman akan otomatis muncul ketika ada radio yang selesai siaran (Live).
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {paginationData && paginationData.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
                            <p className="text-muted-foreground text-sm">
                                Menampilkan {paginationData.from} – {paginationData.to} dari {paginationData.total} data
                            </p>
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
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
