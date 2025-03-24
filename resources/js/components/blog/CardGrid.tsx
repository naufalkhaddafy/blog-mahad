import useBookmark from '@/hooks/useBookmark';
import { getLimitTextContent } from '@/lib/utils';
import { PostProps } from '@/pages/Posts/Partials/Type';
import { BookmarkCheck, BookmarkPlus, ChartLine, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import Badge from './Badge';

export const CardGrid = ({ dataPost }: { dataPost: PostProps }) => {
    const { bookmarks, addBookmark, removeBoomark } = useBookmark();
    const isBookmarked = bookmarks.some((item) => item.slug === dataPost.slug);

    return (
        <Card className="group relative flex h-full w-full cursor-pointer flex-col gap-0 overflow-hidden bg-green-100/50 p-0 dark:bg-green-100/20">
            <img
                src={dataPost.imageSrc}
                alt={dataPost.title}
                className="aspect-video object-fill brightness-100 transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
            />
            <div className="flex h-full w-full flex-col justify-center rounded-t-lg p-5 text-left backdrop-blur-md lg:px-10 lg:py-6">
                <div className="flex items-center justify-between gap-3 text-xs font-extralight text-green-900 lg:text-sm dark:text-green-400">
                    <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        {dataPost.created_at}
                    </div>
                    <div className="flex gap-2 rounded-2xl p-1">
                        <ChartLine className="size-4 text-gray-400 lg:size-5" />
                        {dataPost.views}
                    </div>
                </div>
                <h3 className="text-md py-1 font-bold lg:py-6 lg:text-xl">
                    {getLimitTextContent(dataPost.title, 100)}
                </h3>
                <p className="text-xs lg:text-lg">
                    {getLimitTextContent(dataPost.description, 100)}
                </p>
            </div>
            <div className="absolute top-0 left-0 flex w-full items-start justify-between gap-2 px-4 py-4 lg:px-6 lg:py-6">
                <div className="flex h-fit flex-wrap gap-2 overflow-hidden">
                    <Badge>{dataPost.category?.name || 'No Category'}</Badge>
                    {dataPost.tags.map((dataTags, index) => (
                        <Badge key={index}>{dataTags.label}</Badge>
                    ))}
                </div>
                <div className="rounded-sm bg-green-100 p-1 transition-all duration-300 hover:scale-130 active:scale-130">
                    {isBookmarked ? (
                        <BookmarkCheck
                            className="size-5 cursor-pointer text-green-600 lg:size-6"
                            onClick={(e) => {
                                e.preventDefault();
                                removeBoomark(dataPost.slug);
                            }}
                        />
                    ) : (
                        <BookmarkPlus
                            className="size-5 cursor-pointer text-green-600 lg:size-6"
                            style={{ pointerEvents: 'auto' }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addBookmark({
                                    slug: dataPost.slug,
                                    title: dataPost.title,
                                    image: dataPost.imageSrc,
                                });
                            }}
                        />
                    )}
                </div>
            </div>
        </Card>
    );
};
