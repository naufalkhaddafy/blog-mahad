'use client';
import Editor from '@/components/Editor';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { MultiSelect } from '@/components/multi-select';
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
import axios from 'axios';
import { CheckCircle, Eye, LoaderCircle, Save } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryProps } from '../Categories/Partials/Type';
import { TagPropsSelect } from '../Tags/Partials/Type';
import { PageSettingsProps, PostProps } from './Partials/Type';
import PreviewModal from './Partials/PreviewModal';
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
    tags: Array<TagPropsSelect>;
    status: Array<number>;
};

type DraftStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function Form({ posts, page_settings, categories, tags, status }: FormAddProps) {
    const { errors } = usePage().props;
    const [processing, setProcessing] = useState<boolean>();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [draftStatus, setDraftStatus] = useState<DraftStatus>('idle');
    const [savedAt, setSavedAt] = useState<string | null>(null);
    const [draftPostId, setDraftPostId] = useState<number | null>(posts.id ?? null);
    const [draftUpdateUrl, setDraftUpdateUrl] = useState<string | null>(
        posts.id ? page_settings.url : null,
    );
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    const { data, setData, reset } = useForm({
        title: posts.title || '',
        category_id: posts.category?.id || '',
        description: posts.description || '',
        image: posts.image || '',
        status: posts.status || '',
        tags: posts.tags?.map((tag) => tag.value) || [],
    });

    // Debounced auto-save
    const performAutosave = useCallback(async () => {
        if (!data.title || data.title.trim() === '') return;

        setDraftStatus('saving');
        try {
            const autosaveUrl = draftPostId
                ? `/posts/autosave/${draftPostId}`
                : '/posts/autosave';

            const response = await axios.post(autosaveUrl, {
                title: data.title,
                description: data.description,
                category_id: data.category_id || null,
                tags: data.tags.length > 0 ? data.tags : null,
            });

            setDraftPostId(response.data.id);
            setDraftUpdateUrl(response.data.url);
            setSavedAt(response.data.saved_at);
            setDraftStatus('saved');
        } catch {
            setDraftStatus('error');
        }
    }, [data.title, data.description, data.category_id, data.tags, draftPostId]);

    // Watch form changes and trigger auto-save with debounce
    useEffect(() => {
        // Skip first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Don't auto-save if editing an already published/pending/archived post
        if (posts.id && posts.status !== 'draft' && posts.status !== '') {
            return;
        }

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            performAutosave();
        }, 3000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [data.title, data.description, data.category_id, data.tags]);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Jika post sudah punya ID dari auto-save, kirim update request
        const submitUrl = draftUpdateUrl || page_settings.url;
        const submitMethod = draftUpdateUrl && !posts.id ? 'PATCH' : page_settings.method;

        router.post(
            submitUrl,
            {
                _method: submitMethod === 'POST' ? 'POST' : 'PATCH',
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

    // Image preview URL for PreviewModal
    const imagePreviewUrl =
        typeof data.image === 'object' && data.image !== null
            ? URL.createObjectURL(data.image as unknown as Blob)
            : posts.imageSrc || undefined;

    // Selected tags for preview
    const selectedTags = tags.filter((tag) => data.tags.includes(tag.value));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={page_settings.title} />
            <div className="rounded-xl px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title={`${page_settings.title}`} description={page_settings.description} />

                    {/* Draft Status Indicator */}
                    <div className="flex items-center gap-2 text-sm">
                        {draftStatus === 'saving' && (
                            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-600 dark:bg-amber-900/20">
                                <LoaderCircle className="size-3.5 animate-spin" />
                                Menyimpan draft...
                            </span>
                        )}
                        {draftStatus === 'saved' && savedAt && (
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-600 dark:bg-emerald-900/20">
                                <CheckCircle className="size-3.5" />
                                Draft tersimpan {savedAt}
                            </span>
                        )}
                        {draftStatus === 'error' && (
                            <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-red-600 dark:bg-red-900/20">
                                Gagal menyimpan draft
                            </span>
                        )}
                    </div>
                </div>
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
                                            onValueChange={(selected) => setData('tags', selected)}
                                            defaultValue={data.tags}
                                            placeholder="Pilih Tags"
                                            variant="default"
                                            maxCount={10}
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

                            <div className="mt-3 flex items-center gap-3 py-7">
                                <Button disabled={processing} asChild className="cursor-pointer">
                                    <button type="submit">
                                        {processing && (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        )}
                                        <Save className="size-4" />
                                        Simpan
                                    </button>
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => setPreviewOpen(true)}
                                >
                                    <Eye className="size-4" />
                                    Preview
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <PreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title={data.title}
                description={data.description}
                imageSrc={imagePreviewUrl}
                tags={selectedTags}
                categories={categories}
                categoryId={data.category_id}
            />
        </AppLayout>
    );
}
