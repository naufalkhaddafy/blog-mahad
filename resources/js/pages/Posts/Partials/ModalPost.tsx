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
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PostProps } from './Type';

export const ModalDeletePost = ({ post }: { post: PostProps }) => {
    const { delete: destroy, processing } = useForm({
        id: post.id || '',
    });
    const [open, setOpen] = useState<boolean>(false);

    const deletePost = (post: PostProps) => {
        destroy(route('posts.destroy', post.id), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="hover:bg-secondary flex w-full items-center gap-2 rounded-sm px-2 py-1 text-start text-sm text-red-500">
                    <Trash2 className="size-4" />
                    Hapus
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Apakah anda ingin mengapus postingan ?</DialogTitle>
                <DialogDescription>Konfirmasi ingin menghapus {post.title}</DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" asChild>
                        <button onClick={() => deletePost(post)} disabled={processing}>
                            Delete
                        </button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
