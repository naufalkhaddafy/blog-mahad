import useScroll from '@/hooks/useScroll';
import { ChevronUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';

export const ScrollUp = () => {
    const { completion } = useScroll();
    const scrollRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.classList.toggle('bottom-5', completion > 10);
        scrollRef.current.classList.toggle('lg:bottom-8', completion > 10);
        scrollRef.current.classList.toggle('-bottom-15', completion <= 10);
    }, [completion]);

    return (
        <Button
            ref={scrollRef}
            className="fixed right-1.5 z-10 bg-green-600 p-1 shadow-2xl transition-all duration-500 lg:right-7 lg:p-5 dark:text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <ChevronUp className="size-5 lg:size-6" />
        </Button>
    );
};
