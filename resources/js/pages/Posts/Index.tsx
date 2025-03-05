import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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
            <Head title="Tag Blog" />
            <div className="rounded-xl px-4 py-6">
                <Heading
                    title="Pengaturan Blog "
                    description="Ini merupakan daftar seluruh postingan blog"
                />
                <div className="">
                    <div className="w-full rounded-xl border p-4 shadow xl:col-span-4">
                        <DataTable columns={columns} data={posts} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
