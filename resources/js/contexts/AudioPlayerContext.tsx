import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type AudioTrack = {
    id: string | number;
    title: string;
    type: 'live' | 'recording';
    url: string;
    channel?: string;
};

interface AudioPlayerContextType {
    currentTrack: AudioTrack | null;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    playTrack: (track: AudioTrack) => void;
    togglePlayPause: () => void;
    seekTo: (time: number) => void;
    closePlayer: () => void;
    volume: number;
    setVolume: (vol: number) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
    }
    return context;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        
        const audio = audioRef.current;
        
        const setAudioData = () => setDuration(audio.duration);
        const setAudioTime = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Sync volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle track change
    useEffect(() => {
        if (audioRef.current && currentTrack) {
            const isPlayingCurrently = !audioRef.current.paused;
            const currentSrc = audioRef.current.src;
            
            // Only update src if it changed
            if (!currentSrc.includes(currentTrack.url)) {
                audioRef.current.src = currentTrack.url;
                audioRef.current.play().catch(e => console.error("Playback failed", e));
                setIsPlaying(true);
            } else if (!isPlayingCurrently) {
                audioRef.current.play().catch(e => console.error("Playback failed", e));
                setIsPlaying(true);
            }
        }
    }, [currentTrack]);

    const playTrack = (track: AudioTrack) => {
        setCurrentTrack(track);
    };

    const togglePlayPause = () => {
        if (!audioRef.current || !currentTrack) return;
        
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed", e));
            setIsPlaying(true);
        }
    };

    const seekTo = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const closePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
        setCurrentTrack(null);
    };

    return (
        <AudioPlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                duration,
                currentTime,
                playTrack,
                togglePlayPause,
                seekTo,
                closePlayer,
                volume,
                setVolume,
                audioRef
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};
