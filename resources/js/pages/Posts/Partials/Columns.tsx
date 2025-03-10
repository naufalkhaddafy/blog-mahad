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
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { PostProps } from './Type';

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
        cell: ({ row }) => {
            return <div className="pl-6">{row.index + 1}</div>;
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
            const category = row.original.category ?? 'No Category';

            return (
                <div className="flex w-96 gap-1">
                    <Badge variant="outline">{category}</Badge>
                    <span className="w-full">{title}</span>
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
        header: 'Tags',
        cell: ({ row }) => {
            const tags = row.getValue('tags');
            if (!Array.isArray(tags)) return <div>-</div>;

            return (
                <div className="flex flex-wrap gap-1 text-black">
                    {tags.length > 0
                        ? tags.map((tag) => (
                              <span
                                  key={tag.value}
                                  className="rounded bg-gray-200 px-2 py-1 capitalize"
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
        cell: ({ row }) => (
            <div className="capitalize">
                <Badge variant="outline">{row.getValue('status')}</Badge>
            </div>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const post = row.original;

            const deletePost = (id?: number) => {
                router.delete(route('posts.destroy', id));
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
                        <DropdownMenuItem asChild>
                            <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deletePost(post.id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
