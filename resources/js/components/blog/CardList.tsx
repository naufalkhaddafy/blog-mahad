import { getLimitTextContent } from '@/lib/utils';
import { PostProps } from '@/pages/Posts/Partials/Type';
import { BookmarkPlus, ChartLine, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import Badge from './Badge';

export const CardList = ({ dataPost }: { dataPost: PostProps }) => {
    return (
        <Card className="group relative grid w-full cursor-pointer grid-cols-6 gap-3 overflow-hidden bg-green-100/50 p-2 lg:gap-5 dark:bg-green-100/20">
            <div className="col-span-2 my-auto h-24 w-full overflow-hidden rounded-xl md:h-36 lg:h-40">
                <img
                    src={dataPost.imageSrc}
                    alt={dataPost.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                />
            </div>
            <div className="col-span-4 py-2">
                <div className="h-0 w-full items-center gap-1 md:flex md:h-auto md:justify-between md:py-1">
                    <div className="hidden flex-wrap items-center gap-1 py-1 md:flex">
                        <Badge>{dataPost.category?.name}</Badge>
                        {dataPost.tags.map((dataTags, index) => (
                            <Badge key={index}>{dataTags.label}</Badge>
                        ))}
                    </div>
                    <div className="absolute top-3 right-3 transition-all duration-300 hover:scale-130 md:static md:-translate-x-3 md:-translate-y-2">
                        <BookmarkPlus
                            className="size-5.5 cursor-pointer text-green-600 lg:size-7"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 py-1 text-green-900 lg:py-2 dark:text-green-700">
                    <div className="flex items-center gap-2 text-xs font-extralight">
                        <Clock className="size-4 text-gray-400" />
                        {dataPost.created_at}
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl p-1 text-xs">
                        <ChartLine className="size-3 text-gray-400 lg:size-4" />
                        {dataPost.views}
                    </div>
                </div>
                <h3 className="text-md text-left font-bold lg:text-lg">
                    {getLimitTextContent(dataPost.title, 100)}
                </h3>
                <p className="hidden font-sans text-sm font-extralight md:block">
                    {getLimitTextContent(dataPost.description, 70)}
                </p>
            </div>
        </Card>
    );
};
