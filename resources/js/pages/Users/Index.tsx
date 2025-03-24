import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { columns } from './Partials/Columns';
import { ModalFormUser } from './Partials/ModalUser';

export type UserParams = {
    id?: number;
    name: string;
    email: string;
    username: string;
    posts_count: number;
};

const Index = ({ users }: { users: UserParams[] }) => {
    return (
        <AppLayout>
            <Head title="Manajemen User" />
            <div className="rounded-xl px-4 py-6">
                <Heading title="Manajemen User" description="Kelola user untuk mengakses website" />
                <div className="max-w-5xl">
                    <div className="w-full rounded-xl border p-4 shadow xl:col-span-4">
                        <div className="pb-7">
                            <ModalFormUser />
                        </div>
                        <DataTable columns={columns} data={users} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
