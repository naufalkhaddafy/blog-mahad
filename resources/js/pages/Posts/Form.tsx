'use client';
import Editor from '@/components/Editor';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import MultiSelect, { MultiSelectParams } from '@/components/MultiSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { CategoryProps } from '../Categories/Partials/Type';
import { PageSettingsProps, PostProps } from './Partials/Type';
import UploadImage from './Partials/UploadImage';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Postingan Blog',
        href: '/posts/',
    },
    {
        title: 'Form Postingan Blog',
        href: '/',
    },
];

type FormAddProps = {
    posts: PostProps;
    page_settings: PageSettingsProps;
    categories: Array<CategoryProps>;
    tags: Array<MultiSelectParams>;
    status: Array<number>;
};

export default function Form({ posts, page_settings, categories, tags, status }: FormAddProps) {
    const { errors } = usePage().props;
    const [processing, setProcessing] = useState<boolean>();
    const { data, setData, reset } = useForm({
        title: posts.title || '',
        category_id: posts.category_id || '',
        description: posts.description || '',
        image: posts.image || '',
        status: posts.status || '',
        tags: posts.tags || ([] as MultiSelectParams[]),
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post(
            page_settings.url,
            {
                _method: page_settings.method == 'POST' ? 'POST' : 'PATCH',
                ...data,
            },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onSuccess: () => (page_settings.method == 'POST' ? reset() : ''),
                onFinish: () => setProcessing(false),
            },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={page_settings.title} />
            <div className="rounded-xl px-4 py-6">
                <Heading title={`${page_settings.title}`} description={page_settings.description} />
                <div className="max-w-screen">
                    <div className="w-full rounded-xl border p-4 shadow xl:col-span-4">
                        <form className="p-2" onSubmit={onSubmit}>
                            <div className="grid gap-7 xl:grid-cols-7">
                                <div className="flex w-full flex-col gap-5 xl:col-span-3">
                                    <div>
                                        <Label htmlFor="image">Image</Label>
                                        <UploadImage
                                            setData={setData}
                                            data={posts.imageSrc}
                                            errors={errors.image}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="title">Judul </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            className="w-full"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Masukan Judul"
                                        />
                                        <InputError className="mt-2" message={errors.title} />
                                    </div>

                                    <div>
                                        <Label htmlFor="kategori">Kategori </Label>
                                        <Select
                                            value={`${data.category_id}`}
                                            onValueChange={(value) => setData('category_id', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={`${category.id}`}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.category_id} />
                                    </div>

                                    <div>
                                        <Label htmlFor="tags">Tag</Label>
                                        <MultiSelect
                                            options={tags}
                                            value={Array.isArray(data.tags) ? data.tags : []}
                                            onChange={(selected: MultiSelectParams[]) =>
                                                setData('tags', selected)
                                            }
                                            placeholder="Pilih Tag"
                                        />
                                        <InputError className="mt-2" message={errors.tags} />
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {status.map((status, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={`${status}`}
                                                        className="capitalize"
                                                    >
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.status} />
                                    </div>
                                </div>

                                <div className="gap-2 xl:col-span-4">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Editor
                                        content={data.description}
                                        setContent={(newContent) =>
                                            setData('description', newContent)
                                        }
                                    />
                                    <InputError className="mt-2" message={errors.description} />
                                </div>
                            </div>

                            <div className="mt-3 py-7">
                                <Button disabled={processing} asChild className="cursor-pointer">
                                    <button type="submit">
                                        {processing && (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        )}
                                        Simpan
                                    </button>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
