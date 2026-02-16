import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

/**
 * Skeleton for CardGrid – Large card with image on top
 */
export const SkeletonCardGrid = () => {
    return (
        <Card className="flex h-full w-full flex-col gap-0 overflow-hidden bg-green-100/50 p-0 dark:bg-green-100/20">
            <Skeleton className="aspect-video w-full" />
            <div className="flex h-full w-full flex-col justify-center p-5 lg:px-10 lg:py-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-3 w-10" />
                    </div>
                </div>
                <Skeleton className="mt-3 h-6 w-4/5 lg:mt-6" />
                <Skeleton className="mt-2 h-4 w-3/5" />
            </div>
            <div className="absolute top-0 left-0 flex w-full items-start justify-between gap-2 px-4 py-4 lg:px-6 lg:py-6">
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-7 w-7 rounded-sm" />
            </div>
        </Card>
    );
};

/**
 * Skeleton for CardList – Horizontal card with image on left
 */
export const SkeletonCardList = () => {
    return (
        <Card className="grid w-full grid-cols-6 gap-3 overflow-hidden bg-green-100/50 p-2 lg:gap-5 dark:bg-green-100/20">
            <div className="col-span-2 my-auto overflow-hidden rounded-xl">
                <Skeleton className="h-24 w-full md:h-36 lg:h-40" />
            </div>
            <div className="col-span-4 py-2">
                <div className="hidden items-center justify-between py-1 md:flex">
                    <div className="flex gap-1">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 py-1 lg:py-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="mt-2 hidden h-4 w-3/5 md:block" />
            </div>
        </Card>
    );
};

/**
 * Skeleton for CardNoImage – Text-only card
 */
export const SkeletonCardNoImage = () => {
    return (
        <Card className="p-4">
            <div className="grid">
                <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2 px-1 py-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-6" />
                </div>
                <Skeleton className="mt-1 h-6 w-3/4" />
                <div className="flex items-center gap-2 py-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-5/6" />
                <Skeleton className="mt-1 h-4 w-2/3" />
            </div>
        </Card>
    );
};

/**
 * Skeleton for Poster Swiper items
 */
export const SkeletonPoster = () => {
    return (
        <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                    key={index}
                    className="aspect-square w-full rounded-2xl"
                />
            ))}
        </div>
    );
};

/**
 * Skeleton for Radio channel card
 */
export const SkeletonRadioCard = () => {
    return (
        <Card className="p-5">
            <div>
                <div className="flex gap-5">
                    <Skeleton className="aspect-square w-15 rounded" />
                    <div className="flex-1">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-12 rounded-2xl" />
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-8" />
                        </div>
                    </div>
                </div>
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-3/4" />
                <div className="mt-4">
                    <Skeleton className="h-4 w-4" />
                </div>
            </div>
        </Card>
    );
};
