import { cn } from '@/lib/utils';

export const Container = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <section className={cn('mx-auto my-0 max-w-7xl px-3 md:px-6 lg:px-8 xl:px-0', className)}>
            {children}
        </section>
    );
};
