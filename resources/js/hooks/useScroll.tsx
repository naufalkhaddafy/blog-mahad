import { useEffect, useState } from 'react';

const useScroll = (element?: React.RefObject<HTMLElement | null>) => {
    const [completion, setCompletion] = useState<number>(0);
    const [progress, setProgress] = useState<boolean>(false);

    useEffect(() => {
        const updateScrollCompletion = () => {
            const target = element?.current || document.body;
            const elementTop = target.offsetTop;
            const elementHeight = !element
                ? target.scrollHeight - window.innerHeight
                : target.scrollHeight - 150;
            const currentScroll = window.scrollY;

            const progress = parseFloat(
                Math.min(
                    100,
                    Math.max(0, ((currentScroll - elementTop) / elementHeight) * 100),
                ).toFixed(2),
            );

            setCompletion(progress);
            setProgress(progress > 0 && progress < 100);
        };

        window.addEventListener('scroll', updateScrollCompletion);
        return () => window.removeEventListener('scroll', updateScrollCompletion);
    }, [element]);

    return {
        completion,
        progress,
    };
};

export default useScroll;
