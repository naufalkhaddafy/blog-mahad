import { Card, CardContent } from '@/components/ui/card';
import useRadio from '@/hooks/useRadio';
import { Play, ChevronRight, Mic } from 'lucide-react';
// @ts-ignore
import { Link } from '@inertiajs/react';
import React from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

interface RadioWidgetProps {
    liveChannels: any[];
    recordings: any[];
}

export const RadioWidget: React.FC<RadioWidgetProps> = ({ liveChannels, recordings }) => {
    const { setChannelPlay, setPlaylist } = useRadio();

    const buildRecordingPlaylist = () => {
        return recordings.map((rec: any) => ({
            id: rec.id,
            name: rec.title,
            file_path: rec.file_path,
            description: rec.channel ? `Dari Channel: ${rec.channel.name}` : 'Audio Kajian',
            image: '/assets/logo-kis-new.png',
            type: 'recording' as const,
            stats: {
                name: rec.title,
                listeners: 0,
                description: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(rec.created_at || new Date())),
            },
        }));
    };

    const handlePlayLive = (liveChannel: any) => {
        setChannelPlay({
            id: liveChannel.id,
            name: liveChannel.name,
            url: liveChannel.url,
            description: liveChannel.description,
            status: 'live',
            image: liveChannel.image,
            type: 'live',
            stats: {
                name: liveChannel.servertitle || '',
                listeners: liveChannel.currentlisteners || 0,
                description: liveChannel.songtitle || liveChannel.description,
            }
        });
    };

    const handlePlayRecording = (recording: any) => {
        const playlist = buildRecordingPlaylist();
        const index = playlist.findIndex((r: any) => r.id === recording.id);
        setPlaylist(playlist, index >= 0 ? index : 0);
    };

    const hasContent = recordings.length > 0;

    if (!hasContent) return null;

    return (
        <div className="w-full overflow-hidden rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-all duration-300 dark:border-green-900/30 dark:bg-gray-900 group">
            <div className="flex flex-row items-stretch h-14 sm:h-16">
                {/* Left Label */}
                <div className="bg-green-600 flex flex-col items-center justify-center px-1 sm:px-5 flex-shrink-0 text-white w-20 sm:w-32 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
                    <div className="mb-0.5 sm:mb-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-md flex items-center justify-center p-1 z-10 shadow-sm">
                        <img src="/assets/logo-kis-new.png" alt="KIS" className="w-full h-full object-contain animate-pulse" />
                    </div>
                    <span className="font-bold text-[7.5px] sm:text-[10px] leading-[1.1] text-center tracking-wider uppercase z-10 mt-0.5">Audio Kajian<br />Terbaru</span>
                </div>

                {/* Ticker Content */}
                <div className="flex-1 min-w-0 relative bg-white dark:bg-gray-900">
                    <Swiper
                        direction="vertical"
                        slidesPerView={1}
                        spaceBetween={0}
                        loop={true}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        modules={[Autoplay]}
                        className="h-full w-full"
                    >
                        {recordings.map((rec, idx) => (
                            <SwiperSlide key={`rec-${idx}`}>
                                <div className="flex items-center h-full w-full gap-2 sm:gap-3 px-3 sm:px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors" onClick={() => handlePlayRecording(rec)}>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className="font-bold text-[11px] sm:text-sm text-gray-800 dark:text-gray-200 truncate group-hover:text-green-600 transition-colors" title={rec.title}>
                                            {rec.title}
                                        </h4>
                                        <p className="text-[9px] sm:text-[10px] text-green-600 dark:text-green-400 mt-0.5 truncate flex items-center gap-1.5">
                                            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
                                            </span>
                                            {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(rec.created_at || new Date()))}
                                        </p>
                                    </div>
                                    <button className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white dark:bg-green-900/30 dark:text-green-400 transition-colors flex-shrink-0 shadow-sm border border-green-100 dark:border-green-800">
                                        <Play size={10} fill="currentColor" className="ml-0.5" />
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Right Arrow */}
                <Link href="/audio" className="flex items-center justify-center gap-1 px-3 sm:px-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-500 hover:text-green-600 transition-colors border-l border-gray-100 dark:border-gray-800 flex-shrink-0 group" title="Lihat Semua Audio">
                    <span className="hidden sm:block text-[10px] sm:text-xs font-bold uppercase tracking-wider">Lihat Semua</span>
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
