import useScroll from '@/hooks/useScroll';
import { ChevronUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';

export const ScrollUp = () => {
    const { completion } = useScroll();
    const scrollRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.classList.toggle('hidden', completion <= 10);
    }, [completion]);

    return (
        <Button
            ref={scrollRef}
            className="absolute -top-15 right-3 flex cursor-pointer items-center bg-green-600 p-1 py-2 opacity-100 shadow-2xl transition-all duration-900 lg:right-6 lg:p-5 dark:text-white starting:opacity-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <ChevronUp className="size-5 lg:size-6" />
        </Button>
    );
};
