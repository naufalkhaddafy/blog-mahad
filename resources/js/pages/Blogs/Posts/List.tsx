import { Container } from '@/components/Container';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import BlogLayout from '@/layouts/BlogLayout';
import { getLimitTextContent } from '@/lib/utils';
import { CategoryProps } from '@/pages/Categories/Partials/Type';
import { PostProps } from '@/pages/Posts/Partials/Type';
import { TagPropsSelect } from '@/pages/Tags/Partials/Type';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, Dot, Grid2x2, Rows3 } from 'lucide-react';
import { useState } from 'react';

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string; label: string; active: boolean }>;
}

interface PaginationLinks {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
}

interface PaginatedPosts {
    data: PostProps[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda',
        href: '/',
    },
    {
        title: 'Belajar Islam',
        href: '/belajar-islam',
    },
];

const List = ({
    tags,
    categories,
}: {
    tags: Array<TagPropsSelect>;
    categories: Array<CategoryProps>;
}) => {
    const getQueryParam = (key: string) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    };

    const [filter, setFilter] = useState({
        search: getQueryParam('search') || '',
        category: getQueryParam('category') || '',
        sorting: getQueryParam('sorting') || '',
        tags: getQueryParam('tags')
            ? getQueryParam('tags')!.split(',').map(Number)
            : ([] as string[]),
    });

    const [listStyle, setListStyle] = useState<boolean>(true);
    const { data: posts, meta, links } = usePage<{ posts: PaginatedPosts }>().props.posts;

    const search = async (type: string, data: string | string[]) => {
        setFilter((prev) => {
            const updatedFilter = { ...prev, [type]: data };
            const dataReady = Object.fromEntries(
                Object.entries({
                    search: updatedFilter.search || null,
                    category: updatedFilter.category || null,
                    sorting: updatedFilter.sorting || null,
                    tags: updatedFilter.tags?.length ? updatedFilter.tags.join(',') : null,
                }).filter(([, v]) => Boolean(v)),
            );

            router.get('belajar-islam', dataReady, { preserveState: true, preserveScroll: true });
            return updatedFilter;
        });
    };

    return (
        <BlogLayout breadcrumbs={breadcrumbs}>
            <Head title="Belajar Islam" />
            <Container className="max-w-5xl pt-5">
                <section className="border-b-2 pb-10">
                    <div className="flex flex-wrap items-center justify-between gap-5 pb-5 lg:pb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-green-700">Belajar Islam</h1>
                            <h3 className="flex items-center text-sm text-gray-500 lg:text-lg">
                                Media Belajar Islam Sesuai Al-Qur'an & Sunnah
                                <Dot className="size-8 animate-pulse text-green-700" />
                            </h3>
                        </div>
                        <div className="w-full lg:w-2/5">
                            <Input
                                name="search"
                                placeholder="Cari di sini..."
                                type="search"
                                className="lg:text-md w-full lg:py-5"
                                value={filter.search}
                                onChange={(e) => search('search', e.target.value)}
                            ></Input>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
                        <div className="w-full">
                            <Select
                                value={filter.category}
                                onValueChange={(value) => search('category', value)}
                                name="category"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.length > 0 &&
                                        categories.map((category) => (
                                            <SelectItem value={`${category.id}`} key={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <Select
                                name="sorting"
                                onValueChange={(value) => search('sorting', value)}
                                value={filter.sorting}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder="Pilih Urutkan"
                                        defaultValue={filter.sorting}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Terbaru</SelectItem>
                                    <SelectItem value="asc">Terlama</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 w-full lg:col-span-1">
                            <MultiSelect
                                options={tags}
                                onValueChange={(value) => search('tags', value)}
                                defaultValue={filter.tags}
                                placeholder="Pilih Bab"
                                variant="default"
                                maxCount={10}
                            />
                        </div>
                    </div>
                </section>
                <section>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="pt-5 text-lg font-bold">Hasil pencarian</h1>
                            <h3 className="text-xs text-gray-500 lg:text-sm">
                                Menampilkan {meta.from} - {meta.to} dari{' '}
                                <span className="font-bold text-green-600"> {meta.total}</span>
                            </h3>
                        </div>
                        <Button
                            className="flex items-center gap-2 bg-transparent text-gray-600 shadow-none hover:bg-transparent hover:text-green-700"
                            onClick={() => setListStyle(!listStyle)}
                        >
                            {listStyle ? <Grid2x2 /> : <Rows3 />}
                        </Button>
                    </div>

                    <div className="grid gap-4 py-5 lg:grid-cols-2">
                        {posts.length > 0 ? (
                            posts.map((qna, index: number) => (
                                <Card
                                    key={index + 1}
                                    className="group cursor-pointer p-4 transition-all duration-200 hover:scale-102 hover:border-green-600"
                                >
                                    <Link
                                        href={route('blog.show', {
                                            post: qna.slug,
                                        })}
                                    >
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 px-1 py-2">
                                                <span className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white shadow-xl">
                                                    {qna.category}
                                                </span>
                                                {qna.tags.map((data, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white shadow-xl"
                                                    >
                                                        {data.label}
                                                    </span>
                                                ))}
                                            </div>
                                            <h1 className="text-lg font-semibold">{qna.title}</h1>
                                            <span className="flex items-center gap-2 py-1 text-sm text-gray-400">
                                                <Clock className="size-4" /> {qna.created_at}
                                            </span>
                                            <p className="text-justify">
                                                {getLimitTextContent(qna.description, 150)}
                                            </p>
                                        </div>
                                    </Link>
                                </Card>
                            ))
                        ) : (
                            <div className="text-md col-span-5 py-10 text-center lg:text-lg">
                                Mohon maaf postingan tidak tersedia
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="w-full py-10 text-center">
                        <Pagination>
                            <PaginationContent className="flex-wrap justify-center">
                                <PaginationPrevious
                                    href={links.prev}
                                    className={!links.prev ? 'cursor-no-drop' : ''}
                                />
                                {meta.links.slice(1, -1).map((link, index) => (
                                    <PaginationItem key={index}>
                                        {link.url ? (
                                            <PaginationLink href={link.url} isActive={link.active}>
                                                {link.label}
                                            </PaginationLink>
                                        ) : (
                                            <PaginationEllipsis />
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationNext
                                    href={links.next}
                                    className={!links.next ? 'cursor-no-drop' : ''}
                                />
                            </PaginationContent>
                        </Pagination>
                    </div>
                </section>
            </Container>
        </BlogLayout>
    );
};

export default List;
