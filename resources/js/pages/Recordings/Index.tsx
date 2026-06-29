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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    const [selectTrim, setSelectTrim] = useState<any | null>(null);
    const [showTrimConfirm, setShowTrimConfirm] = useState(false);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const [showStopConfirm, setShowStopConfirm] = useState<number | null>(null);

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setShowBulkDeleteConfirm(true);
    };

    const executeBulkDelete = () => {
        router.delete(route('recordings.bulk-destroy'), {
            data: { ids: selectedIds },
            onSuccess: () => {
                setSelectedIds([]);
                setShowBulkDeleteConfirm(false);
            }
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(items.map((item: any) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        }
    };

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const parseTime = (timeStr: string) => {
        if (!timeStr) return 0;
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return 0;
    };

    const [filterSearch, setFilterSearch] = useState(filters?.search || '');
    const [filterPublished, setFilterPublished] = useState(filters?.is_published || '');
    const [filterDate, setFilterDate] = useState(filters?.date || '');
    const [filterPerPage, setFilterPerPage] = useState(filters?.per_page?.toString() || '10');

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
                per_page: filterPerPage,
            }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);

        return () => clearTimeout(timeout);
    }, [filterSearch, filterPublished, filterDate, filterPerPage]);

    const clearFilters = () => {
        setFilterSearch('');
        setFilterPublished('');
        setFilterDate('');
        setFilterPerPage('10');
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

    const trimForm = useForm<{ start_time: string; end_time: string }>({
        start_time: '00:00:00',
        end_time: '01:00:00',
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
        setSelectTrim(null);
        setShowUpload(false);
        reset();
        uploadForm.reset();
        trimForm.reset();
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

    const handleTrim = (rec: any) => {
        setSelectTrim(rec);
        setDuration(0);
        trimForm.setData({
            start_time: '00:00:00',
            end_time: '00:00:00',
        });
    };

    const onTrimSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowTrimConfirm(true);
    };

    const executeTrim = () => {
        trimForm.post(route('recordings.trim', selectTrim.id), {
            onSuccess: () => {
                trimForm.reset();
                setSelectTrim(null);
                setShowTrimConfirm(false);
            },
            onError: () => {
                setShowTrimConfirm(false);
            }
        });
    };

    const handleDelete = (id: number) => {
        setShowDeleteConfirm(id);
    };

    const executeDelete = () => {
        if (showDeleteConfirm !== null) {
            router.delete(route('recordings.destroy', showDeleteConfirm), {
                onSuccess: () => setShowDeleteConfirm(null)
            });
        }
    };

    const handleStop = (id: number) => {
        setShowStopConfirm(id);
    };

    const executeStop = () => {
        if (showStopConfirm !== null) {
            router.post(route('recordings.stop', showStopConfirm), {}, {
                onSuccess: () => setShowStopConfirm(null)
            });
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

                    {selectTrim && (
                        <div className="mb-6 rounded-xl border p-4 shadow bg-blue-50/50">
                            <h3 className="font-bold text-lg mb-2">Potong Audio: <span className="text-blue-600">{selectTrim.title}</span></h3>
                            <p className="text-sm text-gray-600 mb-4">Pilih bagian audio yang ingin dipertahankan. File asli akan langsung tertimpa (replaced).</p>

                            <div className="mb-4">
                                <audio
                                    controls
                                    className="w-full"
                                    src={`/storage/${selectTrim.file_path}?v=${new Date(selectTrim.updated_at || '').getTime()}`}
                                    ref={audioRef}
                                    onLoadedMetadata={(e) => {
                                        const d = (e.target as HTMLAudioElement).duration;
                                        setDuration(d);
                                        trimForm.setData({
                                            start_time: '00:00:00',
                                            end_time: formatTime(d)
                                        });
                                    }}
                                />
                            </div>

                            <form onSubmit={onTrimSubmit}>
                                <div className="bg-white p-4 rounded-md border">
                                    <div className="flex justify-between text-sm font-bold mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs font-normal">Waktu Mulai</span>
                                            <span className="text-blue-600 font-mono text-base">{trimForm.data.start_time}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-gray-500 text-xs font-normal">Waktu Selesai</span>
                                            <span className="text-red-600 font-mono text-base">{trimForm.data.end_time}</span>
                                        </div>
                                    </div>

                                    <div className="relative w-full h-8 flex items-center">
                                        {/* Track Background */}
                                        <div className="absolute w-full h-3 bg-gray-200 rounded-full" />

                                        {/* Highlighted Range */}
                                        <div
                                            className="absolute h-3 bg-blue-200 rounded-full pointer-events-none"
                                            style={{
                                                left: `${(parseTime(trimForm.data.start_time) / (duration || 1)) * 100}%`,
                                                right: `${100 - (parseTime(trimForm.data.end_time) / (duration || 1)) * 100}%`
                                            }}
                                        />

                                        {/* Start Slider */}
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 100}
                                            step="1"
                                            className="absolute w-full h-3 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:shadow-md"
                                            value={parseTime(trimForm.data.start_time)}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const maxVal = parseTime(trimForm.data.end_time) - 1;
                                                const safeVal = Math.min(val, maxVal);
                                                trimForm.setData('start_time', formatTime(safeVal));
                                                if (audioRef.current) audioRef.current.currentTime = safeVal;
                                            }}
                                        />

                                        {/* End Slider */}
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 100}
                                            step="1"
                                            className="absolute w-full h-3 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:shadow-md"
                                            value={parseTime(trimForm.data.end_time)}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const minVal = parseTime(trimForm.data.start_time) + 1;
                                                const safeVal = Math.max(val, minVal);
                                                trimForm.setData('end_time', formatTime(safeVal));
                                                if (audioRef.current) audioRef.current.currentTime = safeVal;
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button type="submit" disabled={trimForm.processing}>Potong & Simpan</Button>
                                    <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
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
                        <select
                            className="flex h-10 max-w-[100px] rounded-md border border-input bg-white px-3 py-2 text-sm"
                            value={filterPerPage}
                            onChange={(e) => setFilterPerPage(e.target.value)}
                        >
                            <option value="10">10 </option>
                            <option value="25">25 </option>
                            <option value="50">50 </option>
                            <option value="100">100 </option>
                        </select>
                        {(filterSearch !== '' || filterPublished !== '' || filterDate !== '' || filterPerPage !== '10') && (
                            <Button variant="destructive" onClick={clearFilters}>Reset Filter</Button>
                        )}
                        {selectedIds.length > 0 && (
                            <Button variant="destructive" onClick={handleBulkDelete}>
                                Hapus {selectedIds.length} Terpilih
                            </Button>
                        )}
                    </div>

                    <div className="rounded-md border overflow-x-auto bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px] text-center">
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer rounded border-gray-300 text-red-600 focus:ring-red-500"
                                            checked={items.length > 0 && selectedIds.length === items.length}
                                            onChange={(e) => toggleSelectAll(e.target.checked)}
                                        />
                                    </TableHead>
                                    <TableHead className="w-[40px]"></TableHead>
                                    <TableHead>Informasi Rekaman</TableHead>
                                    <TableHead>Audio Player</TableHead>
                                    <TableHead className="text-center">Published</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500 h-32">
                                            Belum ada rekaman yang tersedia. Rekaman akan otomatis muncul ketika ada radio yang selesai siaran (Live).
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-center">
                                                <input
                                                    type="checkbox"
                                                    className="cursor-pointer rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                    checked={selectedIds.includes(item.id)}
                                                    onChange={(e) => toggleSelect(item.id, e.target.checked)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Disc size={20} className={item.status === 'recording' ? 'animate-spin text-red-500 mx-auto' : 'text-gray-400 mx-auto'} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="min-w-48 max-w-[250px] sm:max-w-[300px] md:max-w-[450px] lg:max-w-[600px] whitespace-normal break-words">
                                                    <TooltipProvider delayDuration={300}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <h3 className="text-sm font-bold line-clamp-2 cursor-help text-left">
                                                                    {item.title}
                                                                </h3>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] break-words whitespace-normal p-3 z-50">
                                                                <p className="font-medium">{item.title}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <div className="py-1 text-xs text-gray-500">
                                                        Channel: <strong>{item.channel?.name || '-'}</strong> &bull; Status: {item.status.toUpperCase()}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">
                                                        {new Date(item.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Makassar', dateStyle: 'medium', timeStyle: 'short' })} WITA &bull; {formatBytes(item.file_size)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item.status === 'completed' ? (
                                                    <div className="w-full min-w-48">
                                                        <audio controls className="h-9 w-full" preload="none">
                                                            <source src={`/storage/${item.file_path}?v=${new Date(item.updated_at).getTime()}`} type="audio/mpeg" />
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
                                                        {item.status === 'completed' && (
                                                            <DropdownMenuItem onClick={() => handleTrim(item)}>
                                                                Potong Audio
                                                            </DropdownMenuItem>
                                                        )}
                                                        {item.status === 'recording' && (
                                                            <DropdownMenuItem onClick={() => handleStop(item.id)} className="text-orange-600">
                                                                Hentikan Rekaman
                                                            </DropdownMenuItem>
                                                        )}
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
                                            .replace('Previous', 'Previous')
                                            .replace('Next', 'Next');

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

            {/* Modal Konfirmasi Potong Audio */}
            <Dialog open={showTrimConfirm} onOpenChange={setShowTrimConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Potong Audio</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin memotong rekaman ini dari <strong className="text-black">{trimForm.data.start_time}</strong> hingga <strong className="text-black">{trimForm.data.end_time}</strong>?
                            <br /><br />
                            <span className="text-red-600 font-semibold">Perhatian:</span> File mentah rekaman ini akan langsung tertimpa (terhapus dan diganti dengan versi yang dipotong) untuk menghemat penyimpanan. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowTrimConfirm(false)}>Batal</Button>
                        <Button variant="destructive" onClick={executeTrim} disabled={trimForm.processing}>
                            {trimForm.processing ? 'Memotong...' : 'Ya, Potong & Timpa'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Massal</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus {selectedIds.length} rekaman terpilih?
                            <br /><br />
                            <span className="text-red-600 font-semibold">Perhatian:</span> File audio dari rekaman-rekaman tersebut juga akan terhapus secara permanen dari server. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowBulkDeleteConfirm(false)}>Batal</Button>
                        <Button variant="destructive" onClick={executeBulkDelete}>
                            Ya, Hapus {selectedIds.length} Rekaman
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteConfirm !== null} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus rekaman ini?
                            <br /><br />
                            <span className="text-red-600 font-semibold">Perhatian:</span> File audio juga akan terhapus secara permanen dari server. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Batal</Button>
                        <Button variant="destructive" onClick={executeDelete}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showStopConfirm !== null} onOpenChange={(open) => !open && setShowStopConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hentikan Rekaman</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghentikan rekaman ini?
                            <br /><br />
                            Tindakan ini akan menghentikan proses rekaman secara manual dan menyimpan file audio yang berhasil direkam sejauh ini.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowStopConfirm(null)}>Batal</Button>
                        <Button variant="destructive" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={executeStop}>
                            Ya, Hentikan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
};

export default Index;
