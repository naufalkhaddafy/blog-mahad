import { useEffect, useState } from 'react';

const useScroll = () => {
    const [completion, setCompletion] = useState<number>(0);
    useEffect(() => {
        const updateScrollCompletion = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;

            if (scrollHeight) {
                const progress = parseFloat((currentProgress / scrollHeight).toFixed(2)) * 100;
                setCompletion(progress);
            }
        };

        window.addEventListener('scroll', updateScrollCompletion);
        return () => window.removeEventListener('scroll', updateScrollCompletion);
    }, []);

    return completion;
};

export default useScroll;
