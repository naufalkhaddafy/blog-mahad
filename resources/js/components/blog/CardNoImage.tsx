import useBookmark from '@/hooks/useBookmark';
import { getLimitTextContent } from '@/lib/utils';
import { PostProps } from '@/pages/Posts/Partials/Type';
import { BookmarkCheck, BookmarkPlus, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import Badge from './Badge';

export const CardNoImage = ({ dataPost }: { dataPost: PostProps }) => {
    const { bookmarks, addBookmark, removeBoomark } = useBookmark();
    const isBookmarked = bookmarks.some((item) => item.slug === dataPost.slug);

    return (
        <Card className="group cursor-pointer p-4 transition-all duration-200 hover:scale-102 hover:border-green-600">
            <div className="grid">
                <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2 px-1 py-2">
                        <Badge>{dataPost.category?.name}</Badge>
                        {dataPost.tags.map((data, index) => (
                            <Badge key={index}>{data.label}</Badge>
                        ))}
                    </div>
                    <div className="transition-all duration-300 hover:scale-130 active:scale-130">
                        {isBookmarked ? (
                            <BookmarkCheck
                                className="size-5.5 cursor-pointer text-green-600 lg:size-7"
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeBoomark(dataPost.slug);
                                }}
                            />
                        ) : (
                            <BookmarkPlus
                                className="size-5.5 cursor-pointer text-green-600 lg:size-7"
                                onClick={(e) => {
                                    e.preventDefault();
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
                <h3 className="text-lg font-semibold">{dataPost.title}</h3>
                <span className="flex items-center gap-2 py-1 text-sm text-gray-400">
                    <Clock className="size-4" /> {dataPost.created_at}
                </span>
                <p className="text-justify">{getLimitTextContent(dataPost.description, 150)}</p>
            </div>
        </Card>
    );
};
