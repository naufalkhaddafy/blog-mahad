import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { columns } from './Partials/Columns';
import { DataTable } from './Partials/DataTable';
import { Category, CategoryForm } from './Partials/Type';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori',
        href: '/category',
    },
];

export default function Index({ categories }: { categories: Array<Category> }) {
    const { data, setData, post, processing, errors, reset } = useForm<CategoryForm>({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('category.store'), {
            onFinish: () => reset(),
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Blog" />

            <div className="rounded-xl px-4 py-6">
                <Heading title="Pengaturan Kategori" description="Manage kategori untuk blog" />
                <div className="grid gap-4 xl:grid-cols-6">
                    <div className="xl:col-span-2">
                        <form onSubmit={submit}>
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>Tambah Kategori</CardTitle>
                                    <CardDescription>kategori untuk postingan blog</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="name">Nama Kategori</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                placeholder="Name kategori"
                                                onChange={(e) => setData('name', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button type="submit" disabled={processing}>
                                        Tambah
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </div>
                    <div className="w-full rounded-xl border p-4 shadow xl:col-span-4">
                        <DataTable columns={columns} data={categories} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
