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
    chartData: ChartData[];
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

export default function Visitors({ stats, chartData, recentVisits, filters }: VisitorsProps) {
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

    const maxViews = chartData.length > 0 ? Math.max(...chartData.map((d) => d.page_views), 1) : 1;

    // Filter Logic
    const initialDateRange: DateRange | undefined = filters.start_date && filters.end_date ? {
        from: new Date(filters.start_date),
        to: new Date(filters.end_date)
    } : undefined;

    const [date, setDate] = useState<DateRange | undefined>(initialDateRange);

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

                {/* Visitor Chart */}
                <Card className="flex flex-col border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-2 text-white">
                            <Activity className="h-4 w-4" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold">Trafik Kunjungan (Filter: {filters.start_date ? `${filters.start_date} s/d ${filters.end_date}` : '14 Hari Terakhir'})</CardTitle>
                            <p className="text-xs text-muted-foreground">Views & Unique Visitors</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-end pt-4 min-h-[250px] overflow-hidden">
                        {chartData.length > 0 ? (
                            <div className="flex w-full items-end gap-2 overflow-x-auto pb-2" style={{ height: 200 }}>
                                {chartData.map((day, i) => {
                                    const hViews = Math.max((day.page_views / maxViews) * 160, 8);
                                    const hVisitors = Math.max((day.visitors / maxViews) * 160, 4);

                                    return (
                                        <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-1 min-w-[40px]" style={{ height: '100%' }}>
                                            <div className="flex gap-1 items-end w-full justify-center">
                                                <div
                                                    className="w-1/2 max-w-[12px] rounded-t-sm bg-blue-500 opacity-80 transition-all hover:opacity-100"
                                                    style={{ height: hViews }}
                                                    title={`Views: ${day.page_views}`}
                                                />
                                                <div
                                                    className="w-1/2 max-w-[12px] rounded-t-sm bg-emerald-500 opacity-80 transition-all hover:opacity-100"
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
                                <p className="text-sm">Belum ada data grafik di rentang tanggal ini.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

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
