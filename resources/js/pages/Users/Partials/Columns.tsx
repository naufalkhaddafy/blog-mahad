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
import { router } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';

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
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-2 px-2">
                    <span className={user.is_suspended ? 'line-through opacity-50' : ''}>
                        {row.getValue('name')}
                    </span>
                    {user.is_suspended && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Nonaktif
                        </span>
                    )}
                </div>
            );
        },
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
        cell: ({ row }) => {
            const count = row.getValue('posts_count') as number;
            const user = row.original;
            return count > 0 ? (
                <a
                    href={`/posts?user=${user.id}`}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                >
                    {count} post
                </a>
            ) : (
                <span className="text-sm text-muted-foreground">0</span>
            );
        },
    },
    {
        accessorKey: 'last_login_at',
        header: 'Login Terakhir',
        cell: ({ row }) => {
            const lastLogin = row.getValue('last_login_at') as string | null;
            return (
                <span className="text-sm text-muted-foreground">
                    {lastLogin ?? 'Belum pernah'}
                </span>
            );
        },
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const user = row.original;
            const isSuperAdmin = user.role === 'super-admin';
            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={!user.is_suspended}
                        disabled={isSuperAdmin}
                        onCheckedChange={() => router.post(`/users/${user.id}/toggle-suspend`, {}, { preserveScroll: true })}
                    />
                    <span className={`text-xs font-medium ${user.is_suspended ? 'text-red-500' : 'text-emerald-600'}`}>
                        {user.is_suspended ? 'Nonaktif' : 'Aktif'}
                    </span>
                </div>
            );
        },
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <ModalDeleteUser user={user} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
