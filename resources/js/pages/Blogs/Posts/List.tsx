import { CardGrid } from '@/components/blog/CardGrid';
import { CardList } from '@/components/blog/CardList';
import { EmptyPost } from '@/components/blog/EmptyPost';
import { Container } from '@/components/Container';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
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
import { CategoryProps } from '@/pages/Categories/Partials/Type';
import { PostProps } from '@/pages/Posts/Partials/Type';
import { TagPropsSelect } from '@/pages/Tags/Partials/Type';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Dot, Grid2x2, RotateCcw, Rows3 } from 'lucide-react';
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

    const tagsSelected = getQueryParam('tags') ? getQueryParam('tags')!.split(',').map(String) : [];

    const [filter, setFilter] = useState({
        search: getQueryParam('search') || '',
        category: getQueryParam('category') || '',
        sorting: getQueryParam('sorting') || '',
        tags: tags.filter((tag) => tagsSelected.includes(tag.slug)).map((tag) => tag.value),
    });

    const [listStyle, setListStyle] = useState<boolean>(true);
    const { data: posts, meta, links } = usePage<{ posts: PaginatedPosts }>().props.posts;

    const search = async (type: string, data: string | string[]) => {
        if (type === 'tags') {
            const tagSlugs = tags.filter((tag) => data.includes(tag.value)).map((tag) => tag.slug);
            data = tagSlugs;
        }
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
        <>
            <Head title="Belajar Islam">
                <meta name="author" content="Kajian Islam Sangatta"></meta>
                <meta name="robots" content="index, follow"></meta>
                <meta
                    name="description"
                    content="Kajian Islam Sangatta, Kajian Islam, Belajar Islam, Al Quran, Hadits, Sesuai dengan Pemahaman Salaf"
                ></meta>
            </Head>
            <Container className="max-w-5xl pt-5">
                <header className="border-b-2 pb-10">
                    <h1 className="sr-only">
                        {getQueryParam('category')
                            ?.replace(/-/g, ' ')
                            .split(' ')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ') || 'Belajar Islam'}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-5 pb-5 lg:pb-10">
                        <div>
                            <h2 className="text-primary text-3xl font-bold dark:text-green-600">
                                Belajar Islam
                            </h2>
                            <p className="flex items-center text-sm text-gray-500 lg:text-lg">
                                Media Belajar Islam Sesuai Al-Qur'an & Sunnah
                                <span aria-hidden="true">
                                    <Dot className="size-8 animate-pulse text-green-700 dark:text-green-400" />
                                </span>
                            </p>
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
                                            <SelectItem
                                                value={`${category.slug}`}
                                                key={category.id}
                                            >
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
                                    <SelectItem value="popular">Populer</SelectItem>
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
                </header>
                <section>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="pt-5 text-lg font-bold">Hasil pencarian</h3>
                            <p className="text-xs text-gray-500 lg:text-sm">
                                Menampilkan {meta.from} - {meta.to} dari
                                <span className="font-bold text-green-600"> {meta.total}</span>
                            </p>
                        </div>
                        <Button
                            className="flex items-center gap-2 bg-transparent text-gray-600 shadow-none hover:bg-transparent hover:text-green-700"
                            onClick={() => setListStyle(!listStyle)}
                        >
                            {listStyle ? <Rows3 /> : <Grid2x2 />}
                        </Button>
                    </div>

                    <div
                        className={`grid auto-rows-min gap-4 py-5 ${listStyle ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}
                    >
                        {posts.length > 0 ? (
                            posts.map((post, index: number) =>
                                listStyle ? (
                                    <Link
                                        key={index}
                                        href={route('blog.show', {
                                            post: post.slug,
                                        })}
                                    >
                                        <CardGrid dataPost={post} />
                                    </Link>
                                ) : (
                                    <Link
                                        key={index}
                                        href={route('blog.show', {
                                            post: post.slug,
                                        })}
                                    >
                                        <CardList dataPost={post} />
                                    </Link>
                                ),
                            )
                        ) : (
                            <div className="col-span-2 text-center">
                                <EmptyPost>Afwan postingan tidak tersedia</EmptyPost>
                                <Button asChild>
                                    <Link href="belajar-islam">
                                        Reset Filter <RotateCcw />
                                    </Link>
                                </Button>
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
        </>
    );
};

export default List;

List.layout = (page: React.ReactNode) => <BlogLayout breadcrumbs={breadcrumbs} children={page} />;
