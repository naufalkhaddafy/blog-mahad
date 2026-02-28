import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, BarChart, MonitorPlay, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Stat {
    totalPageVisits: number;
    todayPageVisits: number;
    totalUniqueVisitors: number;
    todayUniqueVisitors: number;
}

interface ChartData {
    visited_date: string;
    visitors: number;
    page_views: number;
}

interface Visit {
    id: number;
    url: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
    user?: {
        name: string;
    };
}

interface VisitorsProps {
    stats: Stat;
    chartData: ChartData[];
    recentVisits: Visit[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Visitor Stats',
        href: '/visitors',
    },
];

export default function Visitors({ stats, chartData, recentVisits }: VisitorsProps) {
    const statCards = [
        {
            title: 'Total View',
            value: stats.totalPageVisits,
            icon: BarChart,
            gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600',
            description: 'Statistik Halaman',
        },
        {
            title: 'View Hari Ini',
            value: stats.todayPageVisits,
            icon: Activity,
            gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
            description: 'Hari ini',
        },
        {
            title: 'Total Visitor Unik',
            value: stats.totalUniqueVisitors,
            icon: Users,
            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            description: 'Pengunjung unik (sesi)',
        },
        {
            title: 'Visitor Hari ini',
            value: stats.todayUniqueVisitors,
            icon: MonitorPlay,
            gradient: 'bg-gradient-to-br from-orange-500 to-red-600',
            description: 'Hari ini',
        },
    ];

    const maxViews = Math.max(...chartData.map((d) => d.page_views), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visitor Stats" />

            <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-10">
                {/* Header */}
                <div className="space-y-2">
                    <Heading title="Visitor Stats" description="Pantau trafik kunjungan website secara real-time" />
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="group relative overflow-hidden border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 ${stat.gradient}`} />
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                <div className={`rounded-lg p-2 text-white shadow-lg transition-transform group-hover:scale-110 ${stat.gradient}`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Visitor Chart */}
                    <Card className="flex flex-col border-none shadow-lg">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-2 text-white">
                                <Activity className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold">Trafik Kunjungan 14 Hari Terakhir</CardTitle>
                                <p className="text-xs text-muted-foreground">Views & Unique Visitors</p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 items-end pt-4 min-h-[250px]">
                            {chartData.length > 0 ? (
                                <div className="flex w-full items-end gap-2 overflow-x-auto" style={{ height: 200 }}>
                                    {chartData.map((day, i) => {
                                        const hViews = Math.max((day.page_views / maxViews) * 160, 8);
                                        const hVisitors = Math.max((day.visitors / maxViews) * 160, 4);

                                        return (
                                            <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
                                                <div className="flex gap-1 items-end w-full justify-center">
                                                    <div
                                                        className="w-1/2 max-w-[12px] rounded-t-sm bg-blue-500 opacity-80"
                                                        style={{ height: hViews }}
                                                        title={`Views: ${day.page_views}`}
                                                    />
                                                    <div
                                                        className="w-1/2 max-w-[12px] rounded-t-sm bg-emerald-500 opacity-80"
                                                        style={{ height: hVisitors }}
                                                        title={`Visitors: ${day.visitors}`}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                                                    {new Date(day.visited_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex w-full h-full flex-col items-center justify-center text-muted-foreground">
                                    <Activity className="h-10 w-10 opacity-20 mb-2" />
                                    <p className="text-sm">Belum ada data grafik</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Page Visits */}
                    <Card className="border-none shadow-lg max-h-[400px] overflow-hidden flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2 shrink-0">
                            <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-2 text-white">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold">Trafik Kunjungan Langsung</CardTitle>
                                <p className="text-xs text-muted-foreground">20 Riwayat kunjung terbaru</p>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-y-auto">
                            <div className="space-y-4">
                                {recentVisits.map((visit) => (
                                    <div key={visit.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                                        <div className="space-y-1 overflow-hidden pr-4">
                                            <p className="text-sm font-medium truncate" title={visit.url}>
                                                {new URL(visit.url).pathname}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="font-semibold">{visit.user ? visit.user.name : visit.ip_address}</span>
                                                <span>•</span>
                                                <span className="truncate" title={visit.user_agent}>{visit.user_agent.split(' ')[0]}...</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground shrink-0 mt-1">
                                            {formatDistanceToNow(new Date(visit.created_at), { addSuffix: true, locale: id })}
                                        </div>
                                    </div>
                                ))}
                                {recentVisits.length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground py-10">Belum ada history view.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
