import { RadioPlay } from './RadioPlay';
import { ScrollUp } from './ScrollUp';

export const ContentBottomFix: React.FC = () => {
    return (
        <section className="fixed bottom-0 z-30 w-full bg-amber-300">
            <ScrollUp />
            <RadioPlay />
        </section>
    );
};
