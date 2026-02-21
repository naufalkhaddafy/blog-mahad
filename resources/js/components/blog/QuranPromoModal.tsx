import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, ShieldCheck, SmartphoneNfc, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export const QuranPromoModal = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem('quran-promo-dismissed');
        if (!dismissed) {
            const timer = setTimeout(() => setOpen(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        setOpen(false);
        sessionStorage.setItem('quran-promo-dismissed', 'true');
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (!v) dismiss();
                else setOpen(v);
            }}
        >
            <DialogContent className="overflow-hidden border-0 bg-transparent p-0 shadow-none sm:max-w-lg [&>button]:hidden">
                <DialogTitle className="sr-only">Al-Quran Digital</DialogTitle>
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6 shadow-2xl sm:p-8">
                    {/* Close button */}
                    <button
                        onClick={dismiss}
                        className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/20" />
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/15" />
                        <div className="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-white/10" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-5 text-center">
                        {/* Icon */}
                        <div className="relative">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
                                <BookOpen className="h-10 w-10 text-white" />
                            </div>
                            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 animate-pulse text-yellow-300" />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-yellow-900">
                                <Sparkles className="h-3 w-3" /> BARU
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                <ShieldCheck className="h-3 w-3" /> TANPA IKLAN
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Al-Quran Digital</h2>

                        {/* Description */}
                        <p className="text-sm text-green-100/90 sm:text-base">
                            Baca dan dengarkan Al-Quran langsung dari HP — <strong className="text-white">gratis, tanpa iklan</strong>, dan
                            bisa di-install sebagai aplikasi di layar utama HP antum!
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-green-200">
                            <span className="flex items-center gap-1">
                                <SmartphoneNfc className="h-4 w-4" /> Install di HP
                            </span>
                            <span className="h-1 w-1 rounded-full bg-green-300" />
                            <span>Terjemahan Lengkap</span>
                            <span className="h-1 w-1 rounded-full bg-green-300" />
                            <span>Audio Murottal</span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex w-full flex-col gap-3 pt-2">
                            <Link
                                href="/al-quran"
                                onClick={() => sessionStorage.setItem('quran-promo-dismissed', 'true')}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-green-700 shadow-lg transition-all duration-300 hover:bg-yellow-400 hover:text-yellow-900 hover:shadow-xl sm:text-base"
                            >
                                Buka Sekarang
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <button onClick={dismiss} className="text-sm text-green-200 transition-colors hover:text-white">
                                Nanti Saja
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
