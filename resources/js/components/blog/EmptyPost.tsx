import { cn } from '@/lib/utils';

export const EmptyPost = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div className={cn('col-span-5 py-5 text-center text-sm lg:text-lg', className)}>
            {children}
        </div>
    );
};
