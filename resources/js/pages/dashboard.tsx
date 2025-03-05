import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FolderTree, MessageCircleQuestion, Send, Tag } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ posts }: { posts: number }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="grid grid-cols-2 gap-4 rounded-xl p-4 xl:grid-cols-4">
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
                        <h6 className="text-sm font-semibold">Total Tag</h6>
                        <Tag className="size-4" />
                    </div>
                    <div className="block py-2">
                        <h3 className="text-4xl font-extrabold">78</h3>
                    </div>
                </div>
                <div className="border-xl w-full rounded-lg border px-7 py-6 shadow">
                    <div className="flex items-center justify-between py-2">
                        <h6 className="text-sm font-semibold">Total Kategori</h6>
                        <FolderTree className="size-4" />
                    </div>
                    <div className="block py-2">
                        <h3 className="text-4xl font-extrabold">80</h3>
                    </div>
                </div>
                <div className="border-xl w-full rounded-lg border px-7 py-6 shadow">
                    <div className="flex items-center justify-between py-2">
                        <h6 className="text-sm font-semibold">Total Pertanyaan</h6>
                        <MessageCircleQuestion className="size-4" />
                    </div>
                    <div className="block py-2">
                        <h3 className="text-4xl font-extrabold">100</h3>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
