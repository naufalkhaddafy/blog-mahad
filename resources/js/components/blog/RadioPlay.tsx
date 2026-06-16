import useRadio from '@/hooks/useRadio';
import { globalAudio } from '@/lib/globalAudio';
// @ts-ignore
import { router } from '@inertiajs/react';
import { ChevronUp, Download, List, Mic, Pause, Play, SkipBack, SkipForward, Square, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Container } from '../Container';

export const RadioPlay = () => {
    const { channel, setChannelPlay, playNext, playPrev, hasNext, hasPrev, playlist, currentIndex, setPlaylist } = useRadio();
    const [pause, setPause] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);

    const audio = globalAudio.audio;

    useEffect(() => {
        const handlePlay = () => { setPause(false); };
        const handlePlaying = () => { setIsLoading(false); setPause(false); };
        const handlePause = () => setPause(true);
        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => { setIsLoading(false); };
        const handleError = () => setErrors(true);
        const handleEnded = () => { if (hasNext) playNext(); };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('ended', handleEnded);

        // Sync initial state
        setPause(audio.paused);
        setIsLoading(false);
        setErrors(false);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('playing', handlePlaying);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('canplaythrough', handleCanPlay);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audio, hasNext]);

    const togglePlayPause = () => {
        if (audio.paused) {
            audio.play().catch((e) => console.error(e));
        } else {
            audio.pause();
        }
    };

    const handleStop = () => {
        setChannelPlay();
        setShowPlaylist(false);
    };

    const isActive = !!(channel.url || channel.file_path);

    return (
        <>
            {isActive && (
                <div className="relative bg-green-800 transition-all duration-500 ease-in-out transform translate-y-0">
                    {/* Expand Handle */}
                    {channel.type === 'recording' && playlist.length > 1 && !showPlaylist && (
                        <button
                            onClick={() => setShowPlaylist(true)}
                            className="absolute -top-8 left-0 w-full bg-green-900 h-8 flex items-center justify-center gap-2 cursor-pointer hover:bg-green-700 transition text-xs font-bold text-green-100 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t border-green-800"
                        >
                            <ChevronUp size={16} className="animate-bounce mt-1" />
                            LIHAT DAFTAR AUDIO
                        </button>
                    )}
                    {/* Collapsible Playlist Panel */}
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            channel.type === 'recording' && showPlaylist && playlist.length > 0
                                ? 'max-h-[400px] opacity-100'
                                : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="bg-green-950 border-b border-green-800 shadow-inner">
                            <Container className="w-full max-w-2xl px-3 py-3">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <p className="text-green-400 text-xs font-bold uppercase tracking-wider">Daftar Audio Terbaru({playlist.length})</p>
                                    <button onClick={() => setShowPlaylist(false)} className="text-white/60 hover:text-white cursor-pointer bg-white/10 p-1 rounded-full transition">
                                        <ChevronUp size={16} className="rotate-180" />
                                    </button>
                                </div>
                                <div className="max-h-56 overflow-y-auto space-y-1.5 scrollbar-hide">
                                    {playlist.slice(0, 10).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition border ${
                                                idx === currentIndex
                                                    ? 'bg-green-800 border-green-600 text-white shadow-sm'
                                                    : 'bg-green-900/40 border-transparent text-white/70 hover:bg-green-800/60'
                                            }`}
                                        >
                                            <button
                                                onClick={() => setPlaylist(playlist, idx)}
                                                className="flex-1 flex items-center gap-3 min-w-0 text-left cursor-pointer group"
                                            >
                                                <div className={`h-7 w-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs shadow-sm transition ${
                                                    idx === currentIndex ? 'bg-green-500 text-white font-bold' : 'bg-green-800 text-white/50 group-hover:bg-green-700 group-hover:text-white'
                                                }`}>
                                                    {idx === currentIndex ? '▶' : idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <p className={`text-sm truncate transition ${idx === currentIndex ? 'font-bold text-green-50' : 'font-medium group-hover:text-white'}`}>{item.name}</p>
                                                    <p className={`text-xs transition ${idx === currentIndex ? 'text-green-200' : 'text-white/40 group-hover:text-white/60'}`}>{item.stats?.description}</p>
                                                </div>
                                            </button>
                                            
                                            <a
                                                href={`/storage/${item.file_path}`}
                                                download={`${item.name}.mp3`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 p-2 rounded-full bg-green-700/50 hover:bg-blue-600 text-white/70 hover:text-white transition shadow-sm cursor-pointer"
                                                title="Download Audio"
                                            >
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    ))}
                                    {playlist.length > 10 && (
                                        <button
                                            onClick={() => {
                                                setShowPlaylist(false);
                                                router.visit('/audio-kajian');
                                            }}
                                            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-green-300 hover:text-white py-3 hover:bg-green-800/50 rounded-xl transition cursor-pointer mt-2 border border-green-800 border-dashed"
                                        >
                                            Lihat Semua Audio Kajian ({playlist.length}) →
                                        </button>
                                    )}
                                </div>
                            </Container>
                        </div>
                    </div>

                    {/* Main Player Bar */}
                    <Container className="w-full max-w-2xl pl-3 pr-6 py-3 text-white">
                        {errors ? (
                            <div className="flex items-center justify-between px-3 py-5">
                                <p>Afwan radio tidak dapat diputar</p>
                                <button onClick={handleStop}>
                                    <X className="cursor-pointer transition duration-300 hover:scale-130 hover:text-red-500 active:text-red-500" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-4">
                                <div
                                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                                    onClick={() => channel.type === 'recording' ? router.visit('/audio-kajian') : router.visit('/radio-online')}
                                >
                                    {/* Icon / Image */}
                                    {channel.type === 'recording' ? (
                                        <div className="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                                            <Mic size={20} className="text-white" />
                                        </div>
                                    ) : channel.image ? (
                                        <img
                                            src={channel.image}
                                            alt={channel.name}
                                            className="aspect-square w-11 rounded-lg flex-shrink-0"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-lg bg-green-700 flex items-center justify-center flex-shrink-0">
                                            <Play size={18} fill="currentColor" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="overflow-hidden flex-1 min-w-0">
                                        {/* Top line (static) */}
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            {channel.status === 'live' ? (
                                                <>
                                                    <span className="font-semibold text-white/80 line-clamp-1">{channel.name}</span>
                                                    <span className="flex-shrink-0 flex animate-pulse items-center rounded-full bg-red-700 px-2 py-0.5 text-[9px] sm:text-[10px] text-white font-semibold">
                                                        Live
                                                    </span>
                                                </>
                                            ) : channel.type === 'recording' ? (
                                                <>
                                                    <span className="line-clamp-1">{channel.stats?.description}</span>
                                                    <span className="flex-shrink-0 flex items-center rounded-full bg-blue-600 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] text-white font-semibold">
                                                        Audio Kajian
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{channel.name}</span>
                                            )}
                                        </div>
                                        {/* Bottom line: marquee */}
                                        {/* @ts-ignore */}
                                        <marquee behavior="scroll" direction="left" scrollamount="2" className="font-bold text-sm mt-0.5">
                                            {channel.stats?.description || channel.description}
                                            {/* @ts-ignore */}
                                        </marquee>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-2">
                                    {isLoading ? (
                                        <div className="px-3">
                                            <div className="size-7 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        </div>
                                    ) : (
                                        <>
                                            {channel.type === 'recording' && (
                                                <button
                                                    onClick={playPrev}
                                                    disabled={!hasPrev}
                                                    className={`cursor-pointer rounded-full p-2 transition ${hasPrev ? 'bg-green-700 hover:bg-green-500' : 'bg-green-900/50 opacity-40 cursor-not-allowed'}`}
                                                >
                                                    <SkipBack className="size-4" fill="currentColor" />
                                                </button>
                                            )}
                                            <button
                                                onClick={togglePlayPause}
                                                className="cursor-pointer rounded-full bg-green-700 p-2 transition hover:bg-green-500"
                                            >
                                                {!pause ? (
                                                    <Pause className="size-4" />
                                                ) : (
                                                    <Play className="size-4" />
                                                )}
                                            </button>
                                            {channel.type === 'recording' && (
                                                <button
                                                    onClick={playNext}
                                                    disabled={!hasNext}
                                                    className={`cursor-pointer rounded-full p-2 transition ${hasNext ? 'bg-green-700 hover:bg-green-500' : 'bg-green-900/50 opacity-40 cursor-not-allowed'}`}
                                                >
                                                    <SkipForward className="size-4" fill="currentColor" />
                                                </button>
                                            )}
                                            <button
                                                onClick={handleStop}
                                                className="cursor-pointer rounded-full bg-green-700 p-2 transition hover:bg-green-500"
                                            >
                                                <Square className="size-4" />
                                            </button>

                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </Container>
                </div>
            )}
        </>
    );
};
