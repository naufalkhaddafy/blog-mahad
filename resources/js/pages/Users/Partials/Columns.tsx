'use client';

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
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { UserParams } from '../Index';
import { ModalDeleteUser, ModalFormUser } from './ModalUser';

export const columns: ColumnDef<UserParams>[] = [
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
                    Nama Pengguna
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="px-2">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'username',
        header: 'Username',
        cell: ({ row }) => <div className="">{row.getValue('username')}</div>,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.getValue('role') as string;
            const isSuperAdmin = role === 'super-admin';
            return (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isSuperAdmin
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                >
                    {role}
                </span>
            );
        },
    },
    {
        accessorKey: 'posts_count',
        header: 'Postingan',
        cell: ({ row }) => <div>{row.getValue('posts_count')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row, table }) => {
            const user = row.original;
            const roles = (table.options.meta as any)?.roles ?? [];

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <ModalFormUser user={user} roles={roles} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <ModalDeleteUser user={user} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
