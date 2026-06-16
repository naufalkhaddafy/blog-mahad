import { channelParams } from '@/hooks/useRadio';

/**
 * Global audio singleton that persists across Inertia page navigations.
 * This lives outside React's lifecycle so it won't be destroyed on remount.
 */
class GlobalAudioManager {
    private static instance: GlobalAudioManager;
    private _audio: HTMLAudioElement | null = null;
    private _channel: channelParams | null = null;
    private _playlist: channelParams[] = [];
    private _currentIndex: number = -1;
    private _listeners: Set<() => void> = new Set();

    static getInstance(): GlobalAudioManager {
        if (!GlobalAudioManager.instance) {
            GlobalAudioManager.instance = new GlobalAudioManager();
        }
        return GlobalAudioManager.instance;
    }

    get audio(): HTMLAudioElement {
        if (!this._audio) {
            this._audio = new Audio();
        }
        return this._audio;
    }

    get channel(): channelParams | null {
        return this._channel;
    }

    get playlist(): channelParams[] {
        return this._playlist;
    }

    get currentIndex(): number {
        return this._currentIndex;
    }

    setChannel(ch: channelParams | null) {
        this._channel = ch;
        this.notify();
    }

    setPlaylist(list: channelParams[], startIndex: number = 0) {
        this._playlist = list;
        this._currentIndex = startIndex;
        if (list.length > 0 && list[startIndex]) {
            this._channel = list[startIndex];
        }
        this.notify();
    }

    setCurrentIndex(idx: number) {
        this._currentIndex = idx;
        this.notify();
    }

    subscribe(listener: () => void) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    private notify() {
        this._listeners.forEach((fn) => fn());
    }
}

export const globalAudio = GlobalAudioManager.getInstance();
