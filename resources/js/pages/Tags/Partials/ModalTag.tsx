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
import { PencilIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { TagProps } from './Type';

export const ModalEditTag = ({ tag }: { tag: TagProps }) => {
    const { data, setData, patch, processing, errors } = useForm({
        name: tag.name || '',
    });

    const [open, setOpen] = useState<boolean>(false);

    const updateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('tag.update', tag.id), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="border border-orange-400 bg-transparent text-orange-600 hover:bg-white hover:text-orange-700">
                    <PencilIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Ubah Tag {tag.name}?</DialogTitle>
                <DialogDescription>
                    Mengubah tag ini akan memperbarui semua postingan terkait.
                </DialogDescription>
                <form onSubmit={updateCategory}>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="name">Nama Tag</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                    </div>
                    <DialogFooter className="mt-4 gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button asChild>
                            <button type="submit" disabled={processing}>
                                Simpan
                            </button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export const ModalDeleteTag = ({ tag }: { tag: TagProps }) => {
    const { delete: destroy, processing } = useForm({
        id: tag.id || '',
    });
    const [open, setOpen] = useState<boolean>(false);

    const deleteCategory = (tag: TagProps) => {
        destroy(route('tag.destroy', tag.id), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="border border-red-500 bg-transparent text-red-600 hover:bg-white hover:text-red-500">
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Apakah anda ingin mengapus Tag {tag.name}?</DialogTitle>
                <DialogDescription>Konfirmasi ingin menghapus Tag</DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" asChild>
                        <button onClick={() => deleteCategory(tag)} disabled={processing}>
                            Delete
                        </button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
