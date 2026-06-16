// @ts-ignore
import { Head, router } from '@inertiajs/react';
import BlogLayout from '@/layouts/BlogLayout';
import { Container } from '@/components/Container';
import { ScrollReveal } from '@/components/ScrollReveal';
import useRadio from '@/hooks/useRadio';
import { Play, Pause, Search, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { BreadcrumbItem } from '@/types';

import { RadioPlay } from '@/components/blog/RadioPlay';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/' },
    { title: 'Audio Kajian', href: '' },
];

interface Recording {
    id: number;
    title: string;
    file_path: string;
    file_size: number;
    created_at: string;
    created_at_formatted: string;
    year: string;
    channel: { name: string } | null;
}

interface IndexProps {
    recordings: Record<string, Recording[]>;
    search: string;
}

function formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

const Index = ({ recordings, search }: IndexProps) => {
    const { setPlaylist, channel } = useRadio();
    const [searchQuery, setSearchQuery] = useState(search || '');
    const [collapsedYears, setCollapsedYears] = useState<Record<string, boolean>>({});
    const isFirstRender = useRef(true);

    const years = Object.keys(recordings).sort((a, b) => Number(b) - Number(a));
    const totalRecordings = years.reduce((sum, year) => sum + recordings[year].length, 0);

    // Build flat playlist from all years (sorted newest first)
    const allRecordings = years.flatMap((year) => recordings[year]);

    const buildPlaylist = () => {
        return allRecordings.map((rec) => ({
            id: rec.id,
            name: rec.title,
            file_path: rec.file_path,
            description: rec.channel?.name || 'Audio Kajian',
            type: 'recording' as const,
            image: '/images/default-podcast.png',
            stats: {
                name: rec.title,
                listeners: 0,
                description: rec.created_at_formatted,
            },
        }));
    };

    // Auto-search with debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get('/audio-kajian', { search: searchQuery || undefined }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const toggleYear = (year: string) => {
        setCollapsedYears((prev) => ({ ...prev, [year]: !prev[year] }));
    };

    const handlePlay = (rec: Recording) => {
        const playlist = buildPlaylist();
        const index = playlist.findIndex((r) => r.id === rec.id);
        setPlaylist(playlist, index >= 0 ? index : 0);
    };

    const isCurrentlyPlaying = (rec: Recording) => {
        return channel?.id === rec.id && channel?.type === 'recording';
    };

    return (
        <>
            <Head title="Audio Kajian - Kajian Islam Sangatta">
                <meta name="description" content="Dengarkan koleksi audio kajian Islam ilmiah dari para Asatidz. Tersedia rekaman kajian rutin dan dauroh." />
            </Head>

            <Container className="max-w-4xl">
                <div className="py-8 lg:py-12">
                    {/* Header */}
                    <ScrollReveal variant="fade-up">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                <Mic className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-800 dark:text-green-500 mb-2">
                                Audio Kajian
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {totalRecordings} rekaman audio kajian tersedia
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Search Bar */}
                    <ScrollReveal variant="fade-up" delay={100}>
                        <div className="relative mb-8 max-w-md mx-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari judul audio kajian..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </ScrollReveal>

                    {/* Modern List Layout */}
                    {years.length > 0 ? (
                        <div className="space-y-8 mt-4">
                            {years.map((year, yearIdx) => (
                                <div key={year} className="relative">
                                    <ScrollReveal variant="fade-up" delay={yearIdx * 80}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                                Tahun {year}
                                            </h2>
                                            <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800"></div>
                                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                                {recordings[year].length} audio
                                            </span>
                                        </div>

                                        <div className="grid gap-3">
                                            {recordings[year].map((rec, idx) => {
                                                const playing = isCurrentlyPlaying(rec);
                                                return (
                                                    <div
                                                        key={rec.id}
                                                        className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${playing
                                                                ? 'bg-green-50/80 border-green-200 shadow-sm dark:bg-green-900/20 dark:border-green-800/50'
                                                                : 'bg-white hover:bg-gray-50/80 border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700'
                                                            }`}
                                                    >
                                                        {/* Avatar / Play Button */}
                                                        <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                                                            <button
                                                                onClick={() => handlePlay(rec)}
                                                                className={`h-12 w-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm ${playing
                                                                        ? 'bg-green-600 text-white animate-pulse ring-4 ring-green-600/20'
                                                                        : 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white'
                                                                    }`}
                                                            >
                                                                {playing ? (
                                                                    <Pause size={18} fill="currentColor" />
                                                                ) : (
                                                                    <Play size={18} fill="currentColor" className="ml-1" />
                                                                )}
                                                            </button>

                                                            {/* Info */}
                                                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handlePlay(rec)}>
                                                                <h4 
                                                                    className={`text-base font-bold line-clamp-1 transition-colors ${playing
                                                                        ? 'text-green-700 dark:text-green-400'
                                                                        : 'text-gray-800 group-hover:text-green-600 dark:text-gray-200 dark:group-hover:text-green-400'
                                                                    }`}
                                                                    title={rec.title}
                                                                >
                                                                    {rec.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                                    <span>{rec.created_at_formatted}</span>
                                                                    {rec.file_size ? (
                                                                        <>
                                                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                                            <span>{formatFileSize(rec.file_size)}</span>
                                                                        </>
                                                                    ) : null}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Actions & Badge */}
                                                        <div className="flex items-center justify-between sm:justify-end gap-3 pl-16 sm:pl-0">
                                                            {rec.channel && (
                                                                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                                                    {rec.channel.name}
                                                                </span>
                                                            )}
                                                            <a
                                                                href={`/storage/${rec.file_path}`}
                                                                download={`${rec.title}.mp3`}
                                                                className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-green-600 hover:text-white transition-colors dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-green-600 dark:hover:text-white cursor-pointer"
                                                                title="Download Audio"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </ScrollReveal>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
                            <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Belum ada rekaman</h3>
                            <p className="text-gray-500 text-sm">
                                {searchQuery ? 'Tidak ditemukan audio dengan kata kunci tersebut. Coba gunakan kata kunci lain.' : 'Koleksi audio kajian akan muncul di sini setelah ada rekaman yang diunggah.'}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition cursor-pointer"
                                >
                                    Reset Pencarian
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </Container>

            {/* Sticky Player injected here */}
            <div className="fixed bottom-0 left-0 w-full z-50">
                <RadioPlay />
            </div>
        </>
    );
};

export default Index;

Index.layout = (page: React.ReactNode) => <BlogLayout children={page} breadcrumbs={breadcrumbs} />;
