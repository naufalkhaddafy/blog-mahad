import useRadio from '@/hooks/useRadio';
import { Link, usePage } from '@inertiajs/react';
import { Headphones } from 'lucide-react';
import { Container } from '../Container';
import { Button } from '../ui/button';

const NotifLive = () => {
    const { radio_live } = usePage().props;
    const { channel } = useRadio();

    return (
        <>
            {typeof radio_live !== 'undefined' && radio_live && channel.status !== 'live' && (
                <div className="m-0 bg-gray-800 py-2">
                    <Container>
                        <div className="flex items-center gap-2 lg:gap-5">
                            <span className="relative flex size-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                            </span>
                            <div className="flex w-full items-center justify-between">
                                <p className="text-xs font-semibold text-white lg:text-sm">
                                    Sedang ada kajian Live Streaming
                                </p>
                                <Button
                                    asChild
                                    className="border border-green-800 bg-transparent text-xs"
                                >
                                    <Link href="/radio-online">
                                        <Headphones />
                                        <p>Simak disini</p>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Container>
                </div>
            )}
        </>
    );
};

export default NotifLive;
