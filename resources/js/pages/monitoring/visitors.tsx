import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Activity, BarChart, MonitorPlay, Users, Search } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface Stat {
    totalPageVisits: number;
    todayPageVisits: number;
    totalUniqueVisitors: number;
    todayUniqueVisitors: number;
}

interface TopPage {
    url: string;
    path: string;
    total_views: number;
}

interface DailyVisit {
    visited_date: string;
    total_views: number;
    mobile_views: number;
    desktop_views: number;
}

interface BrowserStat {
    browser: string;
    total: number;
}

interface Visit {
    id: number;
    url: string;
    ip_address: string;
    user_agent: string;
    referer: string;
    created_at: string;
    user?: {
        name: string;
    };
}

interface PaginationLinkType {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedVisits {
    data: Visit[];
    links: PaginationLinkType[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

interface VisitorsProps {
    stats: Stat;
    dailyVisits: DailyVisit[];
    topPages: TopPage[];
    browserStats: BrowserStat[];
    recentVisits: PaginatedVisits;
    filters: {
        start_date: string;
        end_date: string;
    };
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

export default function Visitors({ stats, dailyVisits, topPages, browserStats, recentVisits, filters }: VisitorsProps) {
    const statCards = [
        {
            title: 'Total View',
            value: stats.totalPageVisits,
            icon: BarChart,
            gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600',
            description: 'Statistik Keseluruhan',
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

    const maxDailyViews = dailyVisits.length > 0 ? Math.max(...dailyVisits.map((d) => d.total_views)) : 1;

    // Filter Logic
    const initialDateRange: DateRange | undefined = filters.start_date && filters.end_date ? {
        from: new Date(filters.start_date),
        to: new Date(filters.end_date)
    } : undefined;

    const [date, setDate] = useState<DateRange | undefined>(initialDateRange);
    const [activeTab, setActiveTab] = useState<'device' | 'browser'>('device');

    const handleFilter = (range: DateRange | undefined) => {
        setDate(range);
        if (range?.from && range?.to) {
            router.get(
                route('monitoring.visitors'),
                {
                    start_date: format(range.from, 'yyyy-MM-dd'),
                    end_date: format(range.to, 'yyyy-MM-dd'),
                },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        } else if (!range) {
            // clear filter
            router.get(route('monitoring.visitors'), {}, { preserveState: true, preserveScroll: true, replace: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visitor Stats" />

            <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-10">
                {/* Header components */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Heading title="Visitor Stats" description="Pantau detail trafik kunjungan website Anda" />
                    
                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                        <DateRangePicker 
                            value={date} 
                            onChange={handleFilter} 
                            className="w-[280px]"
                        />
                    </div>
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

                <div className="relative grid gap-8 lg:grid-cols-3">
                    {/* Kolom Kanan: Halaman Populer */}
                    <div className="space-y-4 lg:col-span-1 order-2">
                        <Card className="overflow-hidden border-none shadow-lg h-full">
                            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                <div className="rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-2 text-white shadow-lg">
                                    <BarChart className="size-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">Halaman Populer</CardTitle>
                                    <p className="text-xs text-muted-foreground">Berdasarkan rentang tanggal</p>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {topPages.length > 0 ? (
                                    <div className="space-y-3 flex flex-col justify-between h-full">
                                        <div className="space-y-4">
                                            {topPages.map((page, index) => {
                                                const widthPercent = topPages[0]?.total_views
                                                    ? (page.total_views / topPages[0].total_views) * 100
                                                    : 0;
                                                return (
                                                    <div key={index} className="group space-y-1.5">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="max-w-[70%] truncate font-medium" title={page.path}>
                                                                {page.path === '/' ? 'Beranda' : page.path}
                                                            </span>
                                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                {page.total_views} views
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                                                                style={{ width: `${widthPercent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                                        <Activity className="mb-3 size-10 opacity-20" />
                                        <p className="text-sm">Belum ada data halaman populer.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kiri: Chart Kunjungan & Grafik Demografi */}
                    <div className="space-y-8 flex flex-col items-stretch lg:col-span-2 order-1">
                        {/* Chart 1: Kunjungan Halaman (Atas) */}
                        <Card className="overflow-hidden border-none shadow-lg">
                            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-2 text-white shadow-lg">
                                    <Activity className="size-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">Trafik Kunjungan (Filter: {filters.start_date ? `${filters.start_date} s/d ${filters.end_date}` : 'Semua Data'})</CardTitle>
                                    <p className="text-xs text-muted-foreground">Grafik unique pageviews per hari</p>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {dailyVisits.length > 0 ? (
                                    <div className="flex items-end gap-1 overflow-x-auto sm:gap-2" style={{ height: 200 }}>
                                        {dailyVisits.map((day, i) => {
                                            const maxBarHeight = 160;
                                            const height = maxDailyViews > 0
                                                ? Math.max((day.total_views / maxDailyViews) * maxBarHeight, 4)
                                                : 4;
                                            return (
                                                <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-1 min-w-[30px]" style={{ height: '100%' }}>
                                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                        {day.total_views}
                                                    </span>
                                                    <div className="flex gap-1 items-end w-full justify-center">
                                                        <div
                                                            className="w-full max-w-[30px] rounded-t-sm bg-blue-500 opacity-80 transition-all hover:opacity-100 group-hover:bg-blue-600"
                                                            style={{ height }}
                                                            title={`Views: ${day.total_views}`}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground w-full text-center mt-2 border-t pt-1 border-transparent group-hover:border-border/50 transition-colors">
                                                        {new Date(day.visited_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                                        <Activity className="mb-3 size-10 opacity-20" />
                                        <p className="text-sm">Belum ada data kunjungan.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Chart 2: Data Device & Detail Browser (Bawah, Dalam Tab) */}
                        <Card className="overflow-hidden border-none shadow-lg flex-1 flex flex-col">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/50">
                                <div className="flex flex-row items-center gap-2">
                                    <div className="rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 p-2 text-white shadow-lg">
                                        <MonitorPlay className="size-4" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">Demografi Pengunjung</CardTitle>
                                        <p className="text-xs text-muted-foreground">Statistik Pilihan Pengguna</p>
                                    </div>
                                </div>
                                <div className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-slate-500 sm:w-auto w-full">
                                    <button 
                                        onClick={() => setActiveTab('device')} 
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'device' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    >
                                        Perangkat
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('browser')} 
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'browser' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    >
                                        Browser
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 grow">
                                {activeTab === 'device' && (
                                    <div className="space-y-4">
                                        {/* Legend */}
                                        <div className="flex items-center justify-end gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="size-3 rounded-full bg-blue-500" />
                                                <span className="text-sm font-medium">Desktop ({dailyVisits.reduce((acc, curr) => acc + curr.desktop_views, 0)})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="size-3 rounded-full bg-emerald-500" />
                                                <span className="text-sm font-medium">Mobile ({dailyVisits.reduce((acc, curr) => acc + curr.mobile_views, 0)})</span>
                                            </div>
                                        </div>

                                        {/* 2-bar per day chart */}
                                        {dailyVisits.length > 0 ? (
                                            <div className="flex items-end gap-1 overflow-x-auto sm:gap-2" style={{ height: 200 }}>
                                                {dailyVisits.map((day, i) => {
                                                    const maxBarHeight = 160;
                                                    const maxDeviceViews = Math.max(...dailyVisits.map(d => Math.max(d.desktop_views, d.mobile_views))) || 1;
                                                    const mobileHeight = Math.max((day.mobile_views / maxDeviceViews) * maxBarHeight, 4);
                                                    const desktopHeight = Math.max((day.desktop_views / maxDeviceViews) * maxBarHeight, 4);
                                                    return (
                                                        <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-1 min-w-[40px]" style={{ height: '100%' }}>
                                                            <div className="flex gap-[2px] items-end w-full justify-center">
                                                                <div className="flex flex-col items-center justify-end w-1/2 max-w-[14px]">
                                                                    <span className="mb-1 text-[8px] font-semibold text-slate-600 dark:text-slate-400 text-center">
                                                                        {day.desktop_views}
                                                                    </span>
                                                                    <div
                                                                        className="w-full rounded-t-sm bg-blue-500 opacity-80 transition-all hover:opacity-100 group-hover:bg-blue-600 group-hover:opacity-100"
                                                                        style={{ height: desktopHeight }}
                                                                        title={`Desktop: ${day.desktop_views}`}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col items-center justify-end w-1/2 max-w-[14px]">
                                                                    <span className="mb-1 text-[8px] font-semibold text-slate-600 dark:text-slate-400 text-center">
                                                                        {day.mobile_views}
                                                                    </span>
                                                                    <div
                                                                        className="w-full rounded-t-sm bg-emerald-500 opacity-80 transition-all hover:opacity-100 group-hover:bg-emerald-600 group-hover:opacity-100"
                                                                        style={{ height: mobileHeight }}
                                                                        title={`Mobile: ${day.mobile_views}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground w-full text-center mt-2 border-t pt-1 border-transparent group-hover:border-border/50 transition-colors break-words">
                                                                {new Date(day.visited_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                                                <MonitorPlay className="mb-3 size-10 opacity-20" />
                                                <p className="text-sm">Belum ada data perangkat.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {activeTab === 'browser' && (
                                    <div className="space-y-4 w-full pt-2">
                                        {browserStats.length > 0 ? (
                                            <div className="grid gap-6 sm:grid-cols-2">
                                                {browserStats.map((b, i) => {
                                                    const maxBrowserTotal = Math.max(...browserStats.map(bs => bs.total));
                                                    const widthPercent = (b.total / maxBrowserTotal) * 100;
                                                    return (
                                                        <div key={i} className="group space-y-1.5">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="font-medium truncate pr-2" title={b.browser}>{b.browser}</span>
                                                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                                                                    {b.total} kunjungan
                                                                </span>
                                                            </div>
                                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                                <div
                                                                    className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                                                                    style={{ width: `${widthPercent}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                                                <MonitorPlay className="mb-3 size-10 opacity-20" />
                                                <p className="text-sm">Belum ada data browser.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Visitor Data Table */}
                <Card className="border-none shadow-lg flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-2 text-white">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold">Tabel Kunjungan Detail</CardTitle>
                                <p className="text-xs text-muted-foreground">Menampilkan detail history setiap pengunjung</p>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Menampilkan {recentVisits.from || 0} - {recentVisits.to || 0} dari {recentVisits.total} data
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Waktu</TableHead>
                                    <TableHead>Pengunjung</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Referer</TableHead>
                                    <TableHead className="w-[300px]">User Agent</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentVisits.data.length > 0 ? (
                                    recentVisits.data.map((visit) => (
                                        <TableRow key={visit.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(visit.created_at), 'dd MMM yyyy, HH:mm')}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(visit.created_at), { addSuffix: true, locale: id })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {visit.user ? visit.user.name : visit.ip_address}
                                                    </span>
                                                    {visit.user && (
                                                        <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold dark:bg-blue-900/50 dark:text-blue-400">
                                                            User
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[250px] truncate" title={visit.url}>
                                                    {new URL(visit.url).pathname}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {visit.referer ? (
                                                    <div className="max-w-[200px] truncate whitespace-nowrap text-xs text-muted-foreground" title={visit.referer}>
                                                        {visit.referer.length > 30 ? visit.referer.substring(0, 60) + '...' : visit.referer}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground opacity-50">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[280px] text-xs text-muted-foreground truncate" title={visit.user_agent}>
                                                    {visit.user_agent.split(' ').slice(0, 3).join(' ')}...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            Tidak ada data kunjungan pada rentang tanggal ini.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination Component */}
                        {recentVisits.last_page > 1 && (
                            <div className="py-4 border-t px-6">
                                <Pagination>
                                    <PaginationContent>
                                        {recentVisits.links.map((link, i) => {
                                            // Handling previous and next links
                                            let label = link.label;
                                            if (label.includes('&laquo;')) {
                                                label = 'Previous';
                                            } else if (label.includes('&raquo;')) {
                                                label = 'Next';
                                            }

                                            if (!link.url) {
                                                return (
                                                    <PaginationItem key={i}>
                                                        <span className="px-3 py-2 text-sm text-slate-400 opacity-50 cursor-not-allowed">
                                                            {label === 'Previous' ? '« Prev' : (label === 'Next' ? 'Next »' : label)}
                                                        </span>
                                                    </PaginationItem>
                                                );
                                            }

                                            // Determine component for Prev/Next/Ellipsis/Number
                                            if (label === 'Previous') {
                                                return (
                                                    <PaginationItem key={i}>
                                                        <PaginationPrevious
                                                            href={link.url}
                                                            onClick={(e) => { e.preventDefault(); router.get(link.url as string, {}, { preserveScroll: true }); }}
                                                        />
                                                    </PaginationItem>
                                                );
                                            }

                                            if (label === 'Next') {
                                                return (
                                                    <PaginationItem key={i}>
                                                        <PaginationNext
                                                            href={link.url}
                                                            onClick={(e) => { e.preventDefault(); router.get(link.url as string, {}, { preserveScroll: true }); }}
                                                        />
                                                    </PaginationItem>
                                                );
                                            }
                                            
                                            if (label === '...') {
                                                return (
                                                    <PaginationItem key={i}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        href={link.url}
                                                        isActive={link.active}
                                                        onClick={(e) => { e.preventDefault(); router.get(link.url as string, {}, { preserveScroll: true }); }}
                                                    >
                                                        {label}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
