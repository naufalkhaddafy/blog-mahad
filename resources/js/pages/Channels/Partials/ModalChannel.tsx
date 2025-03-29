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
import { channelParams } from '@/hooks/useRadio';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export const ModalDeleteChannel = ({ channel }: { channel: channelParams }) => {
    const {
        delete: destroy,
        processing,
        reset,
    } = useForm({
        id: channel.id || '',
    });
    const [open, setOpen] = useState<boolean>(false);

    const deleteChannel = (channel: channelParams) => {
        destroy(route('channels.destroy', channel.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
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
                <DialogTitle>Hapus Channel </DialogTitle>
                <DialogDescription>Apakah Anda ingin menghapus {channel.name} ?</DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" asChild>
                        <button onClick={() => deleteChannel(channel)} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Delete
                        </button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
