import useRadio from '@/hooks/useRadio';
import { router } from '@inertiajs/react';
import { LoaderCircle, Pause, Play, Square, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Container } from '../Container';

export const RadioPlay = () => {
    const { channel, setChannelPlay } = useRadio();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [pause, setPause] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const togglePlayPause = (value: string) => {
        if (audioRef.current && value == 'stop') {
            if (audioRef.current.played) {
                setChannelPlay();
                setPause(true);
            }
        } else {
            if (audioRef.current) {
                if (audioRef.current.paused) {
                    audioRef.current.play();
                    setPause(true);
                } else {
                    audioRef.current.pause();
                    setPause(false);
                }
            }
        }
    };

    const handleLoadingFalse = () => {
        setIsLoading(false);
    };

    const handlePause = () => {
        togglePlayPause('stop');
        router.visit('/radio-online');
        setChannelPlay();
    };

    useEffect(() => {
        audioRef.current?.play().then(() => {
            setIsLoading(false);
        });
        setErrors(false);
        setPause(true);
    }, [channel]);

    return (
        <>
            {channel.url && (
                <div className="bg-green-800">
                    <Container className="w-full max-w-2xl px-3 py-4 text-white">
                        {errors ? (
                            <div className="flex items-center justify-between px-3 py-5">
                                <p>Afwan radio tidak dapat diputar</p>
                                <button onClick={handlePause}>
                                    <X className="cursor-pointer transition duration-300 hover:scale-130 hover:text-red-500 active:text-red-500" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-5">
                                <div
                                    className="flex items-center gap-5"
                                    onClick={() => router.visit('/radio-online')}
                                >
                                    <img
                                        src={channel.image}
                                        alt={channel.name}
                                        className="aspect-square w-13 rounded-lg"
                                        loading="lazy"
                                    />
                                    <div className="overflow-hidden">
                                        <div className="flex items-center gap-3 py-2 font-bold text-ellipsis whitespace-nowrap">
                                            {channel.name}
                                            {channel.status === 'live' ? (
                                                <span className="flex animate-pulse items-center rounded-2xl bg-red-700 px-2 py-1 text-xs text-white">
                                                    Live
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <marquee
                                            behavior="scroll"
                                            direction="left"
                                            scrollamount="2"
                                        >
                                            {channel.stats?.description}
                                        </marquee>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <audio
                                        ref={audioRef}
                                        src={`${channel.url}/stream`}
                                        autoPlay
                                        onPlay={handleLoadingFalse}
                                        onPause={() => setPause(false)}
                                        onWaiting={() => setIsLoading(true)}
                                        onCanPlayThrough={handleLoadingFalse}
                                        onError={() => setErrors(true)}
                                    />
                                    <div>{errors && 'errror eg'}</div>
                                    {isLoading ? (
                                        <div className="px-5">
                                            <LoaderCircle className="size-8 animate-spin" />
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => togglePlayPause('pause')}
                                                className="cursor-pointer rounded-full bg-green-700 p-2 transition hover:bg-green-500 active:bg-green-500"
                                            >
                                                {pause ? (
                                                    <Pause className="size-4" />
                                                ) : (
                                                    <Play className="size-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={handlePause}
                                                className="cursor-pointer rounded-full bg-green-700 p-2 transition hover:bg-green-500 active:bg-green-500"
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
