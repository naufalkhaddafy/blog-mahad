import { Link, Head } from '@inertiajs/react';
import { Home, Code } from 'lucide-react';
import React from 'react';

export default function ErrorPage({ status }: { status: number }) {
    // @ts-ignore
    const title = {
        503: '503: Layanan Tidak Tersedia',
        500: '500: Server Error',
        404: '404: Halaman Tidak Ditemukan',
        403: '403: Akses Ditolak',
    }[status] || 'Error';

    // @ts-ignore
    const description = {
        503: 'Maaf, layanan sedang dalam perbaikan. Silakan coba beberapa saat lagi.',
        500: 'Maaf, terjadi kesalahan pada server kami. Kami sedang berusaha memperbaikinya secepat mungkin.',
        404: 'Maaf, halaman yang Anda cari tidak ditemukan. Mungkin URL-nya salah, atau halamannya sudah dihapus.',
        403: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
    }[status] || 'Terjadi kesalahan sistem.';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title={title} />
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-green-600 h-32 relative overflow-hidden flex items-center justify-center">
                    {/* Decorative pattern/shapes */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-green-500/50 blur-xl"></div>
                    <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-green-700/50 blur-xl"></div>
                    
                    <Code className="w-16 h-16 text-white relative z-10 opacity-90 animate-bounce" />
                </div>
                
                <div className="p-8 text-center relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold text-xl border border-red-100">
                            {status}
                        </div>
                    </div>
                    
                    <h1 className="mt-8 text-2xl font-bold text-gray-800 mb-3">{title.split(': ')[1]}</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed text-sm sm:text-base">
                        {description}
                    </p>
                    
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm hover:shadow-md border border-green-700"
                    >
                        <Home size={18} />
                        Kembali ke Beranda
                    </Link>
                </div>
                
                {/* Footer Brand */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-center gap-2">
                    <img src="/assets/logo-kis-new.png" alt="KIS" className="h-6 w-auto opacity-70 grayscale" />
                    <span className="text-xs font-semibold text-gray-400">Kajian Islam Sangatta</span>
                </div>
            </div>
        </div>
    );
}
