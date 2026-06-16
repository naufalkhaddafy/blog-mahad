import { RadioPlay } from './RadioPlay';
import { ScrollUp } from './ScrollUp';

export const ContentBottomFix: React.FC = () => {
    return (
        <section className="fixed inset-x-0 bottom-0 z-30 bg-amber-300">
            <ScrollUp />
            <RadioPlay />
        </section>
    );
};
