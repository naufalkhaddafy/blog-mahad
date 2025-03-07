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

    const deleteCategory = (post: PostProps) => {
        destroy(route('post.destroy', post.id), {
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
                <DialogTitle>Apakah anda ingin mengapus Post {post.title}?</DialogTitle>
                <DialogDescription>Konfirmasi ingin menghapus Post</DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" asChild>
                        <button onClick={() => deleteCategory(post)} disabled={processing}>
                            Delete
                        </button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
