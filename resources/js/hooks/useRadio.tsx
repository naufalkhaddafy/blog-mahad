import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { globalAudio } from '@/lib/globalAudio';

export type channelParams = {
    id: number;
    name: string;
    url?: string;
    description?: string;
    status?: string;
    image?: string;
    type?: 'live' | 'recording';
    file_path?: string;
    stats?: {
        name: string;
        listeners: number;
        description: string;
    };
};

type RadioContextType = {
    channel: channelParams;
    onPlay: boolean;
    playlist: channelParams[];
    currentIndex: number;
    setChannelPlay: (channelPlay?: channelParams) => void;
    setPlaylist: (list: channelParams[], startIndex?: number) => void;
    playNext: () => void;
    playPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
};

const defaultChannel: channelParams = {
    id: 0,
    name: '',
    url: '',
    description: '',
    status: '',
    image: '',
    stats: {
        listeners: 0,
        name: '',
        description: '',
    },
};

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider = ({ children }: { children: React.ReactNode }) => {
    // Subscribe to global audio manager changes
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const unsub = globalAudio.subscribe(() => {
            forceUpdate((n) => n + 1);
        });
        return () => { unsub(); };
    }, []);

    const channel = globalAudio.channel ?? defaultChannel;
    const playlist = globalAudio.playlist;
    const currentIndex = globalAudio.currentIndex;

    const setChannelPlay = (value?: channelParams | null) => {
        if (!value) {
            // Stop & clear
            globalAudio.audio.pause();
            globalAudio.audio.src = '';
            globalAudio.setChannel(null);
            globalAudio.setPlaylist([], -1);
        } else {
            globalAudio.setChannel(value);
            const src = value.type === 'recording'
                ? `/storage/${value.file_path}`
                : `${value.url}/stream`;
            globalAudio.audio.src = src;
            globalAudio.audio.play().catch((e) => console.error('Playback failed', e));
        }
    };

    const setPlaylist = (list: channelParams[], startIndex: number = 0) => {
        globalAudio.setPlaylist(list, startIndex);
        const track = list[startIndex];
        if (track) {
            const src = track.type === 'recording'
                ? `/storage/${track.file_path}`
                : `${track.url}/stream`;
            globalAudio.audio.src = src;
            globalAudio.audio.play().catch((e) => console.error('Playback failed', e));
        }
    };

    const playNext = () => {
        if (currentIndex < playlist.length - 1) {
            const nextIndex = currentIndex + 1;
            globalAudio.setCurrentIndex(nextIndex);
            globalAudio.setChannel(playlist[nextIndex]);
            const track = playlist[nextIndex];
            const src = track.type === 'recording'
                ? `/storage/${track.file_path}`
                : `${track.url}/stream`;
            globalAudio.audio.src = src;
            globalAudio.audio.play().catch((e) => console.error('Playback failed', e));
        }
    };

    const playPrev = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            globalAudio.setCurrentIndex(prevIndex);
            globalAudio.setChannel(playlist[prevIndex]);
            const track = playlist[prevIndex];
            const src = track.type === 'recording'
                ? `/storage/${track.file_path}`
                : `${track.url}/stream`;
            globalAudio.audio.src = src;
            globalAudio.audio.play().catch((e) => console.error('Playback failed', e));
        }
    };

    const hasNext = currentIndex < playlist.length - 1;
    const hasPrev = currentIndex > 0;

    const value: RadioContextType = {
        channel,
        setChannelPlay,
        onPlay: !globalAudio.audio.paused,
        playlist,
        currentIndex,
        setPlaylist,
        playNext,
        playPrev,
        hasNext,
        hasPrev,
    };

    return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
};

const useRadio = () => {
    const context = useContext(RadioContext);
    if (!context) {
        throw new Error('useRadio must be used within a RadioProvider');
    }
    return context;
};

export default useRadio;
