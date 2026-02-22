import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Airplay,
    AudioLines,
    FileText,
    LayoutDashboard,
    MessageCircleQuestion,
    PlusCircle,
    Radio,
    Send,
    Settings,
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

export default function Dashboard({
    posts,
    banner,
    channel,
    qna,
}: {
    posts: number;
    banner: number;
    channel: number;
    qna: number;
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

    const quickActions = [
        { label: 'Tulis Artikel', icon: PlusCircle, href: route('posts.create'), color: 'text-blue-500' },
        { label: 'Manage Kategori', icon: LayoutDashboard, href: route('category.index'), color: 'text-purple-500' },
        { label: 'Setting Radio', icon: Radio, href: route('channels.index'), color: 'text-orange-500' },
        { label: 'Daftar Tanya Jawab', icon: FileText, href: route('posts.index'), color: 'text-emerald-500' },
        { label: 'System Settings', icon: Settings, href: '/settings/profile', color: 'text-gray-500' },
    ];

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

                    {/* Additional info or simplified secondary section could go here */}
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
