'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { ModalDeleteCategory, ModalEditCategory } from './ModalCategory';
import { CategoryProps } from './Type';

const PROTECTED_CATEGORIES = [
    'Artikel',
    'Tanya Jawab',
    'Info Taklim',
    'Info Dauroh',
    'Poster',
    'Info Mahad',
    'Audio',
    'E-Book',
];

export const columns: ColumnDef<CategoryProps>[] = [
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
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nama Kategori
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="px-2">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'count_posts',
        header: 'Artikel Terkait',
        cell: ({ row }) => <div className="capitalize">{row.getValue('count_posts')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original;
            const isProtected = PROTECTED_CATEGORIES.includes(category.name);

            if (isProtected) {
                return null;
            }

            return (
                <div className="flex items-center justify-start gap-2">
                    <ModalEditCategory category={category} />
                    <ModalDeleteCategory category={category} />
                </div>
            );
        },
    },
];
