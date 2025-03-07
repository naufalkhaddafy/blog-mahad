'use client';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react'; // ✅ Import useForm dari Inertia
import { Category } from '../Categories/Partials/Type';
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
    categories: Array<Category>;
    tags: Array<MultiSelectParams>;
    status: Array<number>;
};

export default function Form({ posts, page_settings, categories, tags, status }: FormAddProps) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        title: posts.title || '',
        category_id: posts.category_id || '',
        description: posts.description || '',
        image: posts.image || '',
        status: posts.status || '',
        tags: posts.tags || ([] as MultiSelectParams[]),
    });
    
    const methodType = page_settings.method.toLowerCase();

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        (methodType === 'post' ? post : patch)(page_settings.url, {
            onSuccess: () => {
                reset();
            },
        });
    }
    console.log(data);
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
                                            data={data.image}
                                            errors={errors.image}
                                        />
                                        <InputError className="mt-2" message={errors.image} />
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
                                    <Textarea
                                        className="h-100"
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.description} />
                                </div>
                            </div>

                            <div className="mt-3 py-7">
                                <Button disabled={processing} asChild className="cursor-pointer">
                                    <button type="submit">
                                        {processing ? 'Loading...' : 'Simpan'}
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
