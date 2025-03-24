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
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BannerProps } from '../Index';

export const ModalDeleteBanner = ({ banner }: { banner: BannerProps }) => {
    const {
        delete: destroy,
        processing,
        reset,
    } = useForm({
        id: banner.id || '',
    });
    const [open, setOpen] = useState<boolean>(false);

    const deletePost = (banner: BannerProps) => {
        destroy(route('banner.destroy', banner.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                window.location.reload();
            },
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
                <DialogTitle>Apakah anda ingin mengapus banner ?</DialogTitle>
                <DialogDescription>Konfirmasi ingin menghapus {banner.title}</DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" asChild>
                        <button onClick={() => deletePost(banner)} disabled={processing}>
                            Delete
                        </button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
