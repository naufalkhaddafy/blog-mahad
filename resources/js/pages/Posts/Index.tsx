import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CirclePlus } from 'lucide-react';
import { columns } from './Partials/Columns';
import { PostProps } from './Partials/Type';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Postingan Blog',
        href: '/posts',
    },
];

export default function Index({ posts }: { posts: Array<PostProps> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Postingan Blog" />
            <div className="rounded-xl px-4 py-6">
                <Heading title="Pengaturan Blog " description="Daftar seluruh postingan blog" />
                <div className="max-w-screen">
                    <div className="w-full rounded-xl border p-4 shadow xl:col-span-4">
                        <div className="pb-7">
                            <Button
                                className="bg-green-700 hover:border hover:border-green-600 hover:bg-white hover:text-green-600"
                                asChild
                            >
                                <Link href="/posts/create">
                                    <CirclePlus /> Tambah
                                </Link>
                            </Button>
                        </div>
                        <DataTable columns={columns} data={posts} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
