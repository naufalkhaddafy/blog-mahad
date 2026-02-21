import { Container } from '@/components/Container';
import { ScrollReveal } from '@/components/ScrollReveal';
import { QuranWidget } from '@/components/blog/QuranWidget';
import BlogLayout from '@/layouts/BlogLayout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Chrome, EllipsisVertical, MonitorSmartphone, PlusSquare, Share, Smartphone } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda',
        href: '/',
    },
    {
        title: 'Al-Quran Digital',
        href: '',
    },
];

const steps = {
    android: [
        {
            icon: Chrome,
            title: 'Buka di Chrome ',
            desc: (<>Buka link berikut menggunakan browser Chrome di HP Android kamu. <a href="https://quran-app.kajianislamsangatta.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 underline hover:text-green-500 dark:text-green-400">Klik disini</a></>),
        },
        {
            icon: EllipsisVertical,
            title: 'Ketuk Menu (⋮)',
            desc: 'Ketuk ikon titik tiga di pojok kanan atas browser.',
        },
        {
            icon: PlusSquare,
            title: '"Add to Home screen"',
            desc: 'Pilih opsi "Add to Home screen" atau "Tambahkan ke Layar utama", lalu ketuk "Add".',
        },
    ],
    ios: [
        {
            icon: Smartphone,
            title: 'Buka di Safari ',
            desc: (<>Buka link berikut menggunakan browser Safari di iPhone/iPad kamu. <a href="https://quran-app.kajianislamsangatta.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 underline hover:text-green-500 dark:text-green-400">Klik disini</a></>),
        },
        {
            icon: Share,
            title: 'Ketuk Tombol Share',
            desc: 'Ketuk ikon Share (kotak dengan panah ke atas) di bagian bawah layar.',
        },
        {
            icon: PlusSquare,
            title: '"Add to Home Screen"',
            desc: 'Scroll ke bawah dan pilih "Add to Home Screen", lalu ketuk "Add".',
        },
    ],
};

const Index = () => {
    return (
        <>
            <Head title="Al-Quran Digital - Sangatta">
                <meta name="author" content="Kajian Islam Sangatta"></meta>
                <meta name="robots" content="index, follow"></meta>
                <meta
                    name="description"
                    content="Baca Al-Quran Digital terlengkap dengan terjemahan dan audio murottal di Kajian Islam Sangatta. Media belajar untuk memperdalam pemahaman tentang Al-Qur'an."
                ></meta>
            </Head>
            <Container className="max-w-5xl py-10">
                <header className="mb-10 text-center lg:text-left">
                    <ScrollReveal variant="fade-up">
                        <h1 className="text-primary text-3xl font-bold lg:text-4xl dark:text-green-600">
                            Al-Quran Digital
                        </h1>
                        <p className="mt-2 text-gray-500 lg:text-lg">
                            Membaca dan Mendengarkan Kalamullah secara Online
                        </p>
                    </ScrollReveal>
                </header>
                {/* Install to Home Screen Section */}
                <section className="mb-20">
                    <ScrollReveal variant="fade-up" delay={300}>
                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm sm:p-8 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/30">
                                    <MonitorSmartphone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                                        Install di HP Kamu
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Akses Al-Quran lebih cepat langsung dari layar utama tanpa gangguan iklan
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Android */}
                                <div className="rounded-xl border border-green-200 bg-white/80 p-5 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/80">
                                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                                            <Smartphone className="h-4 w-4 text-green-700 dark:text-green-400" />
                                        </span>
                                        Android (Chrome)
                                    </h3>
                                    <ol className="space-y-3">
                                        {steps.android.map((step, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {/* iOS */}
                                <div className="rounded-xl border border-green-200 bg-white/80 p-5 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/80">
                                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                                            <Smartphone className="h-4 w-4 text-green-700 dark:text-green-400" />
                                        </span>
                                        iPhone / iPad (Safari)
                                    </h3>
                                    <ol className="space-y-3">
                                        {steps.ios.map((step, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            <p className="mt-5 text-center text-xs text-gray-400 dark:text-gray-500">
                                Setelah di-install, kamu bisa membuka Al-Quran Digital langsung dari ikon di layar utama HP — tanpa perlu buka browser lagi ✨
                            </p>
                        </div>
                    </ScrollReveal>
                </section>
                <section className="mb-20">
                    <ScrollReveal variant="fade-up" delay={200}>
                        <QuranWidget />
                    </ScrollReveal>
                </section>
            </Container>
        </>
    );
};

export default Index;

Index.layout = (page: React.ReactNode) => <BlogLayout breadcrumbs={breadcrumbs} children={page} />;
