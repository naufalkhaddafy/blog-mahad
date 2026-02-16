import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

type AnimationVariant = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade';

interface ScrollRevealProps {
    children: React.ReactNode;
    variant?: AnimationVariant;
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
    as?: React.ElementType;
}

const variantStyles: Record<AnimationVariant, { hidden: string; visible: string }> = {
    'fade-up': {
        hidden: 'opacity-0 translate-y-8',
        visible: 'opacity-100 translate-y-0',
    },
    'fade-down': {
        hidden: 'opacity-0 -translate-y-8',
        visible: 'opacity-100 translate-y-0',
    },
    'fade-left': {
        hidden: 'opacity-0 translate-x-8',
        visible: 'opacity-100 translate-x-0',
    },
    'fade-right': {
        hidden: 'opacity-0 -translate-x-8',
        visible: 'opacity-100 translate-x-0',
    },
    'zoom-in': {
        hidden: 'opacity-0 scale-90',
        visible: 'opacity-100 scale-100',
    },
    fade: {
        hidden: 'opacity-0',
        visible: 'opacity-100',
    },
};

export const ScrollReveal = ({
    children,
    variant = 'fade-up',
    delay = 0,
    duration = 600,
    className,
    threshold = 0.15,
    as: Component = 'div',
}: ScrollRevealProps) => {
    const { ref, isVisible } = useScrollAnimation({ threshold });
    const styles = variantStyles[variant];

    return (
        <Component
            ref={ref}
            className={cn(
                'transition-all ease-out',
                isVisible ? styles.visible : styles.hidden,
                className,
            )}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </Component>
    );
};
