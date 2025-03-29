import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Airplay, AudioLines, MessageCircleQuestion, Send } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="grid grid-cols-2 gap-4 rounded-xl p-4 lg:grid-cols-4">
                <div className="border-xl w-full rounded-lg border px-7 py-6 shadow">
                    <div className="flex items-center justify-between py-2">
                        <h6 className="text-sm font-semibold">Total Postingan</h6>
                        <Send className="size-4" />
                    </div>
                    <div className="block py-2">
                        <h3 className="text-4xl font-extrabold">{posts}</h3>
                    </div>
                </div>
                <div className="border-xl w-full rounded-lg border px-7 py-6 shadow">
                    <div className="flex items-center justify-between py-2">
                        <h6 className="text-sm font-semibold">Total Banner</h6>
                        <Airplay className="size-4" />
                    </div>
                    <div className="block py-2">
                        <h3 className="text-4xl font-extrabold">{banner}</h3>
                    </div>
                </div>
                <div className="border-xl w-full rounded-lg border px-7 py-6 shadow">
                    <div className="flex items-center justify-between py-2">
                        <h6 className="text-sm font-semibold">Total Radio Aktif</h6>
                        <AudioLines className="size-4" />
                    </div>
                    <div className="block py-2">
                        <h3 className="text-4xl font-extrabold">{channel}</h3>
                    </div>
                </div>
                <div className="border-xl w-full rounded-lg border px-7 py-6 shadow">
                    <div className="flex items-center justify-between py-2">
                        <h6 className="text-sm font-semibold">Total Pertanyaan</h6>
                        <MessageCircleQuestion className="size-4" />
                    </div>
                    <div className="block py-2">
                        <h3 className="text-4xl font-extrabold">{qna}</h3>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
