import Badge from '@/components/blog/Badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CategoryProps } from '@/pages/Categories/Partials/Type';
import { CircleSmall, CircleUserRound, Eye, X } from 'lucide-react';

interface PreviewModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    imageSrc?: string;
    category?: CategoryProps;
    tags?: Array<{ label: string; value: string }>;
    categories?: Array<CategoryProps>;
    categoryId?: string | number;
}

export default function PreviewModal({
    open,
    onClose,
    title,
    description,
    imageSrc,
    tags,
    categories,
    categoryId,
}: PreviewModalProps) {
    const category = categories?.find((c) => String(c.id) === String(categoryId));
    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto !rounded-2xl p-0 sm:max-w-4xl">
                <DialogHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-white/95 px-6 py-3 backdrop-blur-sm dark:bg-slate-900/95">
                    <div className="flex items-center gap-2">
                        <Eye className="size-5 text-emerald-600" />
                        <DialogTitle className="text-base font-semibold">Preview Postingan</DialogTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="size-8 rounded-full">
                        <X className="size-4" />
                    </Button>
                </DialogHeader>

                {/* Article Preview */}
                <div className="px-6 pb-8 pt-4">
                    <article>
                        <header className="py-1">
                            <div className="flex flex-wrap items-center gap-2">
                                {category && <Badge>{category.name}</Badge>}
                                {tags?.map((tag, index) => (
                                    <Badge key={index}>{tag.label}</Badge>
                                ))}
                            </div>
                            <h1 className="py-6 text-2xl font-bold lg:text-4xl">
                                {title || 'Judul Postingan'}
                            </h1>
                            <div className="mb-5 flex items-center justify-between gap-2 border-y px-1 py-3 font-medium">
                                <div className="flex items-center gap-2 font-medium">
                                    <div className="flex items-center gap-1">
                                        <CircleUserRound size={15} />
                                        <p className="text-sm">Admin</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 lg:text-sm">
                                        <span className="text-gray-700">
                                            <CircleSmall size={8} />
                                        </span>
                                        {today}
                                    </div>
                                </div>
                            </div>
                        </header>

                        {imageSrc && (
                            <figure className="w-full">
                                <img
                                    src={imageSrc}
                                    alt={title}
                                    className="aspect-auto w-full rounded-lg object-cover"
                                />
                            </figure>
                        )}

                        <section className="py-5">
                            {description ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: description }}
                                    className="prose prose-lg max-w-none overflow-hidden dark:prose-invert"
                                />
                            ) : (
                                <p className="text-muted-foreground italic">Belum ada konten deskripsi...</p>
                            )}
                        </section>
                    </article>
                </div>
            </DialogContent>
        </Dialog>
    );
}
