 'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getLimitTextContent } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Archive, ArrowUpDown, ClockArrowUp, Copy, Eye, FileEdit, MoreHorizontal, Pencil, Rss, Trash2 } from 'lucide-react';
import { ModalDeletePost } from './ModalPost';
import { PostProps } from './Type';
import { toast } from 'sonner';

export const columns: ColumnDef<PostProps>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() == 'asc')}
                >
                    No
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row, table }) => {
            const from = (table.options.meta as any)?.from ?? 1;
            return <div className="pl-6">{from + row.index}</div>;
        },
    },
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Judul
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const title = row.getValue('title') as string;
            const category = row.original.category?.name ?? 'No Category';

            return (
                <div className="flex min-w-96 gap-1">
                    <Badge variant="outline">{category}</Badge>
                    <span className="w-full">{getLimitTextContent(title, 70)}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal dibuat',
        cell: ({ row }) => {
            return <div>{row.getValue('created_at')} </div>;
        },
    },
    {
        accessorKey: 'tags',
        header: 'Bab',
        cell: ({ row }) => {
            const tags = row.getValue('tags');
            if (!Array.isArray(tags)) return <div>-</div>;

            return (
                <div className="flex flex-wrap gap-1 text-black">
                    {tags.length > 0
                        ? tags.map((tag) => (
                              <span
                                  key={tag.value}
                                  className="rounded bg-gray-200 px-2 py-1 text-xs capitalize"
                              >
                                  {tag.label}
                              </span>
                          ))
                        : '-'}
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const valueStatus = row.getValue('status');
            return (
                <div className="text-md flex items-center gap-2 capitalize">
                    {valueStatus === 'pending' ? (
                        <ClockArrowUp className="h-4 w-4 text-red-500" />
                    ) : valueStatus === 'publish' ? (
                        <Rss className="h-4 w-4 text-green-500" />
                    ) : valueStatus === 'draft' ? (
                        <FileEdit className="h-4 w-4 text-blue-500" />
                    ) : (
                        <Archive className="h-4 w-4 text-yellow-500" />
                    )}
                    {row.getValue('status')}
                </div>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row, table }) => {
            const post = row.original;
            const onPreview = (table.options.meta as any)?.onPreview;

            const copyLink = () => {
                const url = new URL(window.location.href);
                const shareUrl = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}/${post.slug}`;
                navigator.clipboard.writeText(shareUrl).then(() => {
                    toast.success('Link berhasil disalin!');
                });
            };
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={copyLink}>
                            <Copy className="mr-2 size-4" />
                            Salin link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPreview?.(post)}>
                            <Eye className="mr-2 size-4" />
                            Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/posts/${post.id}/edit`}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-red-600 focus:text-red-600">
                            <ModalDeletePost post={post} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
