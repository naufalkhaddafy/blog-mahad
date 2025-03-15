import { cn } from '@/lib/utils';

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <span
            className={cn(
                'rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white shadow-xl',
                className,
            )}
        >
            {children}
        </span>
    );
};

export default Badge;
