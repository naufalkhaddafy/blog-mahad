import { cn } from '@/lib/utils';

export const Container = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn('mx-auto my-0 max-w-7xl px-3 xl:px-0', className)}>{children}</div>;
};
