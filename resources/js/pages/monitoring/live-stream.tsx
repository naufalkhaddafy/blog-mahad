import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AudioLines, Radio, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Monitoring',
        href: '#',
    },
    {
        title: 'Live Stream',
        href: '/radio/live-stream',
    },
];

interface ChannelStats {
    channel_name: string;
    channel_url: string;
    channel_image: string | null;
    streamstatus?: number;
    currentlisteners?: number;
    peaklisteners?: number;
    maxlisteners?: number;
    servergenre?: string;
    serverurl?: string;
    servertitle?: string;
    songtitle?: string;
    streamhits?: number;
    streamuptime?: number;
    bitrate?: number;
}

export default function LiveStream({ channels }: { channels: ChannelStats[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Live Stream Monitoring" />

            <div className="flex h-full flex-col gap-6 p-4 md:p-6 lg:p-8">
                <Heading title="Live Stream Radio" description="Pantau status siaran radio langsung dan statistik pendengar secara realtime." />

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {channels.map((channel, i) => {
                        const isLive = channel.streamstatus === 1;

                        return (
                            <Card key={i} className="overflow-hidden shadow-md transition-all hover:shadow-lg">
                                <CardContent className="p-0">
                                    <div className="relative h-32 bg-slate-900 overflow-hidden">
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                                        {channel.channel_image ? (
                                            <img
                                                src={`/storage/${channel.channel_image}`}
                                                alt={channel.channel_name}
                                                className="h-full w-full object-cover opacity-50"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-800">
                                                <Radio className="size-12 text-slate-600" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-white truncate pr-2">{channel.channel_name}</h3>
                                            {isLive ? (
                                                <div className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/50">
                                                    <span className="relative flex size-2">
                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                                                        <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
                                                    </span>
                                                    ON AIR
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 rounded-full bg-slate-500/20 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-400/50">
                                                    <div className="size-2 rounded-full bg-slate-400" />
                                                    OFFLINE
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shrink-0">
                                                <AudioLines className="size-4" />
                                            </div>
                                            <div className="space-y-1 overflow-hidden">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sedang Mengudara</p>
                                                <p className="font-medium text-sm leading-tight line-clamp-2" title={isLive ? channel.songtitle : 'Tidak ada siaran'}>
                                                    {isLive && channel.songtitle ? channel.songtitle : 'Tidak ada siaran'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
                                                    <Users className="size-3.5" /> Pendengar
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {isLive ? channel.currentlisteners || 0 : 0}
                                                </p>
                                            </div>
                                            <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
                                                    <Users className="size-3.5 opacity-60" /> Peak
                                                </p>
                                                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                                    {isLive ? channel.peaklisteners || 0 : 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
