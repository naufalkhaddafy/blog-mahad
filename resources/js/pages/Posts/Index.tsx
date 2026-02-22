import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CirclePlus, RotateCcw } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { type DateRange } from 'react-day-picker';
import { columns } from './Partials/Columns';
import { PostProps } from './Partials/Type';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Postingan Blog',
        href: '/posts',
    },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPosts {
    data: PostProps[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    status?: string;
    date_from?: string;
    date_to?: string;
    per_page?: string;
}

interface IndexProps {
    posts: PaginatedPosts;
    filters: Filters;
}

const STATUS_OPTIONS = [
    { value: 'publish', label: 'Publish' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' },
];

const PER_PAGE_OPTIONS = ['10', '25', '50', '100'];

export default function Index({ posts, filters = {} }: IndexProps) {
    const dateRange = useMemo<DateRange | undefined>(() => {
        if (!filters.date_from) return undefined;
        return {
            from: new Date(filters.date_from),
            to: filters.date_to ? new Date(filters.date_to) : undefined,
        };
    }, [filters.date_from, filters.date_to]);

    const applyFilters = useCallback(
        (newFilters: Partial<Filters>) => {
            const merged = { ...filters, ...newFilters };

            // Reset page when changing filters (but not per_page alone)
            const params: Record<string, string> = {};
            if (merged.status) params.status = merged.status;
            if (merged.date_from) params.date_from = merged.date_from;
            if (merged.date_to) params.date_to = merged.date_to;
            if (merged.per_page) params.per_page = merged.per_page;

            router.get('/posts', params, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [filters],
    );

    const handleStatusChange = (value: string) => {
        applyFilters({ status: value === 'all' ? undefined : value });
    };

    const handleDateChange = (range: DateRange | undefined) => {
        applyFilters({
            date_from: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
            date_to: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
        });
    };

    const handlePerPageChange = (value: string) => {
        applyFilters({ per_page: value });
    };

    const handleReset = () => {
        router.get('/posts', {}, { preserveState: true, preserveScroll: true });
    };

    const handlePageClick = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const hasActiveFilters = filters.status || filters.date_from || filters.date_to;

    // Defensive check for data structure
    const tableData = useMemo(() => {
        if (Array.isArray(posts)) return posts;
        if (posts && Array.isArray(posts.data)) return posts.data;
        return [];
    }, [posts]);

    const pagination = useMemo(() => {
        if (posts && !Array.isArray(posts)) return posts;
        return null;
    }, [posts]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Postingan Blog" />
            <div className="rounded-xl px-4 py-6">
                <Heading title="Pengaturan Blog" description="Daftar seluruh postingan blog" />
                <div className="max-w-screen">
                    <div className="w-full rounded-xl border p-4 shadow xl:col-span-4">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-3 pb-5">
                            <Button
                                className="bg-green-700 hover:border hover:border-green-600 hover:bg-white hover:text-green-600"
                                asChild
                            >
                                <Link href="/posts/create">
                                    <CirclePlus className="mr-1 size-4" /> Tambah
                                </Link>
                            </Button>

                            <div className="ml-auto flex flex-wrap items-center gap-3">
                                {/* Status Filter */}
                                <Select value={filters.status ?? 'all'} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {STATUS_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Date Range Filter */}
                                <DateRangePicker
                                    value={dateRange}
                                    onChange={handleDateChange}
                                    placeholder="Filter tanggal"
                                    className="w-auto min-w-[220px]"
                                />

                                {/* Per Page */}
                                <Select value={String(filters.per_page ?? '10')} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PER_PAGE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Reset */}
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                                        <RotateCcw className="mr-1 size-4" /> Reset
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <DataTable columns={columns} data={tableData} hidePagination hideSearch />

                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                                <p className="text-muted-foreground text-sm">
                                    Menampilkan {pagination.from ?? 0} – {pagination.to ?? 0} dari {pagination.total} data
                                </p>
                                <div className="flex items-center gap-1">
                                    {pagination.links && pagination.links.map((link, idx) => {
                                        const isNav = idx === 0 || idx === pagination.links.length - 1;
                                        const label = link.label
                                            .replace('&laquo;', '«')
                                            .replace('&raquo;', '»')
                                            .replace('Previous', 'Prev');

                                        return (
                                            <Button
                                                key={idx}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => handlePageClick(link.url)}
                                                className={isNav ? 'px-3' : 'px-3'}
                                                dangerouslySetInnerHTML={{ __html: label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
