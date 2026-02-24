import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    Airplay,
    AudioLines,
    BarChart3,
    Eye,
    FileText,
    LayoutDashboard,
    MessageCircleQuestion,
    PlusCircle,
    Radio,
    Send,
    Settings,
    TrendingUp,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    gradient: string;
    description?: string;
}

const StatCard = ({ title, value, icon: Icon, gradient, description }: StatCardProps) => (
    <Card className="group relative overflow-hidden border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 ${gradient}`} />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className={`rounded-lg p-2 text-white shadow-lg transition-transform group-hover:scale-110 ${gradient}`}>
                <Icon className="size-4" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

interface TopPage {
    url: string;
    path: string;
    total_views: number;
}

interface DailyVisit {
    visited_date: string;
    total_views: number;
}

export default function Dashboard({
    posts,
    banner,
    channel,
    qna,
    visitsToday,
    visitsWeek,
    visitsTotal,
    topPages,
    dailyVisits,
    period = '7d',
}: {
    posts: number;
    banner: number;
    channel: number;
    qna: number;
    visitsToday: number;
    visitsWeek: number;
    visitsTotal: number;
    topPages: TopPage[];
    dailyVisits: DailyVisit[];
    period?: string;
}) {
    const stats = [
        {
            title: 'Total Postingan',
            value: posts,
            icon: Send,
            gradient: 'bg-linear-to-br from-blue-500 to-indigo-600',
            description: 'Artikel, Info, & Berita',
        },
        {
            title: 'Slider Banner',
            value: banner,
            icon: Airplay,
            gradient: 'bg-linear-to-br from-purple-500 to-pink-600',
            description: 'Konten Promosi Aktif',
        },
        {
            title: 'Radio Aktif',
            value: channel,
            icon: AudioLines,
            gradient: 'bg-linear-to-br from-orange-500 to-red-600',
            description: 'Saluran Streaming',
        },
        {
            title: 'Pertanyaan',
            value: qna,
            icon: MessageCircleQuestion,
            gradient: 'bg-linear-to-br from-emerald-500 to-teal-600',
            description: 'Tunggu Respon Anda',
        },
    ];

    const visitStats = [
        {
            title: 'Pengunjung Hari Ini',
            value: visitsToday,
            icon: Eye,
            gradient: 'bg-linear-to-br from-cyan-500 to-blue-600',
            description: 'Unique Pageviews',
        },
        {
            title: 'Pengunjung Minggu Ini',
            value: visitsWeek,
            icon: Activity,
            gradient: 'bg-linear-to-br from-violet-500 to-purple-600',
            description: '7 Hari Terakhir',
        },
        {
            title: 'Total Pengunjung',
            value: visitsTotal,
            icon: TrendingUp,
            gradient: 'bg-linear-to-br from-amber-500 to-orange-600',
            description: 'Sejak Awal',
        },
    ];

    const maxDailyViews = dailyVisits.length > 0 ? Math.max(...dailyVisits.map((d) => d.total_views)) : 1;

    const quickActions = [
        { label: 'Tulis Artikel', icon: PlusCircle, href: route('posts.create'), color: 'text-blue-500' },
        { label: 'Manage Kategori', icon: LayoutDashboard, href: route('category.index'), color: 'text-purple-500' },
        { label: 'Setting Radio', icon: Radio, href: route('channels.index'), color: 'text-orange-500' },
        { label: 'Daftar Tanya Jawab', icon: FileText, href: route('posts.index'), color: 'text-emerald-500' },
        { label: 'System Settings', icon: Settings, href: '/settings/profile', color: 'text-gray-500' },
    ];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const periodOptions = [
        { value: '1d', label: '1D' },
        { value: '7d', label: '1W' },
        { value: '30d', label: '1M' },
        { value: '365d', label: '1Y' },
    ];

    const periodLabel = periodOptions.find((p) => p.value === period)?.label ?? '1W';

    const handlePeriodChange = (value: string) => {
        router.get('/dashboard', { period: value }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />

            <div className="flex flex-col gap-8 p-6 lg:p-10">
                {/* Hero / Welcome Section */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 to-slate-800 p-8 text-white shadow-2xl lg:p-12">
                    <div className="relative z-10 space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
                            Selamat Datang Kembali, Admin!
                        </h1>
                        <p className="max-w-2xl text-slate-300 text-lg">
                            Kelola konten website Mahad dengan mudah. Pantau statistik harian dan respon pertanyaan jamaah secara real-time.
                        </p>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-24 -right-24 size-96 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-indigo-500/10 blur-3xl" />
                </div>

                <div className="space-y-6">
                    <Heading title="Ringkasan Statistik" description="Status terkini platform Mahad Anda" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>
                </div>

                {/* Traffic / Kunjungan Website Section */}
                <div className="space-y-6">
                    <Heading title="Trafik Kunjungan Website" description="Statistik pengunjung halaman publik" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {visitStats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>
                </div>

                {/* Chart & Top Pages Section */}
                <div className="flex items-center justify-between">
                    <Heading title="Grafik & Halaman Populer" description="Analisis kunjungan website" />
                    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                        {periodOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handlePeriodChange(opt.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                    period === opt.value
                                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Daily Visits Bar Chart */}
                    <div className="space-y-4">
                        <Card className="overflow-hidden border-none shadow-lg">
                            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                <div className="rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 p-2 text-white shadow-lg">
                                    <BarChart3 className="size-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">Kunjungan Harian</CardTitle>
                                    <p className="text-xs text-muted-foreground">Grafik unique pageviews</p>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {dailyVisits.length > 0 ? (
                                    <div className="flex items-end gap-2" style={{ height: 200 }}>
                                        {dailyVisits.map((day, i) => {
                                            const maxBarHeight = 160;
                                            const barHeight = maxDailyViews > 0
                                                ? Math.max((day.total_views / maxDailyViews) * maxBarHeight, 8)
                                                : 8;
                                            return (
                                                <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
                                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                        {day.total_views}
                                                    </span>
                                                    <div
                                                        className="w-full rounded-t-lg bg-linear-to-t from-cyan-500 to-blue-500 transition-all duration-300 group-hover:from-cyan-400 group-hover:to-blue-400"
                                                        style={{ height: barHeight }}
                                                    />
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {formatDate(day.visited_date)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                                        <BarChart3 className="mb-3 size-10 opacity-20" />
                                        <p className="text-sm">Belum ada data kunjungan.</p>
                                        <p className="text-xs">Grafik akan muncul setelah website dikunjungi.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top 5 Halaman Populer */}
                    <div className="space-y-4">
                        <Card className="overflow-hidden border-none shadow-lg">
                            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                <div className="rounded-lg bg-linear-to-br from-violet-500 to-purple-600 p-2 text-white shadow-lg">
                                    <TrendingUp className="size-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">Halaman Populer</CardTitle>
                                    <p className="text-xs text-muted-foreground">Top 5 halaman paling banyak dikunjungi</p>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {topPages.length > 0 ? (
                                    <div className="space-y-3">
                                        {topPages.map((page, index) => {
                                            const widthPercent = topPages[0]?.total_views
                                                ? (page.total_views / topPages[0].total_views) * 100
                                                : 0;
                                            return (
                                                <div key={index} className="group space-y-1">
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
                                                            className="h-full rounded-full bg-linear-to-r from-violet-500 to-purple-500 transition-all duration-500"
                                                            style={{ width: `${widthPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                                        <TrendingUp className="mb-3 size-10 opacity-20" />
                                        <p className="text-sm">Belum ada data halaman populer.</p>
                                        <p className="text-xs">Data akan muncul setelah website dikunjungi.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Quick Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        <Heading title="Aksi Cepat" description="Tautan langsung ke fitur yang sering digunakan" />
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className="group flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all hover:bg-accent hover:shadow-lg"
                                >
                                    <div className={`rounded-xl bg-slate-100 p-3 transition-colors group-hover:bg-white dark:bg-slate-800 ${action.color}`}>
                                        <action.icon className="size-6" />
                                    </div>
                                    <span className="text-sm font-semibold">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Additional info */}
                    <div className="space-y-6">
                        <Heading title="Akses Cepat" description="Informasi sistem lainnya" />
                        <Card className="rounded-2xl border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                <LayoutDashboard className="mb-4 size-10 opacity-20" />
                                <p className="text-sm">Monitor sistem berjalan normal.</p>
                                <p className="text-xs">Versi Platform: 1.2.0</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

