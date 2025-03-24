import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { CirclePlus, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { UserParams } from '../Index';

export const ModalFormUser = ({ user }: { user?: UserParams }) => {
    const [open, setOpen] = useState<boolean>(false);

    const { setData, errors, post, patch, processing, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        username: user?.username || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        (user ? patch : post)(`users/${user?.id || ''}`, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className={`${user ? 'hover:bg-secondary text-red-500" w-full justify-start rounded-sm bg-transparent px-2 py-1 text-start text-sm font-normal' : 'bg-green-700 hover:border hover:border-green-600 hover:bg-white hover:text-green-600'}`}
                >
                    {user ? (
                        'Edit '
                    ) : (
                        <>
                            <CirclePlus className="mr-2" />
                            Pengguna
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-4xl">
                <DialogTitle>{user ? 'Edit' : 'Tambah'} pengguna</DialogTitle>
                <DialogDescription>
                    {user ? 'Edit' : 'Tambah'} pengguna yang dapat mengakses sistem
                </DialogDescription>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                defaultValue={user?.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukan Nama"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username (untuk Login)
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="username"
                                defaultValue={user?.username}
                                placeholder="Masukan username"
                                onChange={(e) => setData('username', e.target.value)}
                            />
                            <InputError message={errors.username} className="mt-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="email"
                                defaultValue={user?.email}
                                placeholder="Masukan email"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                    </div>
                    {user && (
                        <span className="text-sm text-red-700">
                            Masukan password jika ingin diganti
                        </span>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="password"
                                placeholder="Masukan password"
                                type="password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirm_password" className="text-right">
                            Konfirmasi Password
                        </Label>
                        <Input
                            id="confirm_password"
                            placeholder="Masukan Konfirmasi Password"
                            className="col-span-3"
                            type="password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" type="button">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled={processing} className="cursor-pointer" asChild>
                        <button onClick={submit}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Simpan
                        </button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const ModalDeleteUser = ({ user }: { user: UserParams }) => {
    const { delete: destroy, processing } = useForm({
        id: user.id || '',
    });
    const [open, setOpen] = useState<boolean>(false);

    const deletePost = (user: UserParams) => {
        destroy(route('users.destroy', user.id), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="hover:bg-secondary w-full rounded-sm px-2 py-1 text-start text-sm text-red-500">
                    Hapus
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Hapus Pengguna</DialogTitle>
                <DialogDescription>
                    Apakah anda ingin menghapus pengguna {user.name}
                </DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button disabled={processing} variant="destructive" asChild>
                        <button onClick={() => deletePost(user)} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Delete
                        </button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
