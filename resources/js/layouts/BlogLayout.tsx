// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Footer } from '@/components/blog/Footer';
import { Navbar } from '@/components/blog/Navbar';

export const BlogLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <header className="m-0 mb-4 bg-green-700 text-white shadow-2xl">
                <div></div>
                <Navbar />
            </header>
            <main>{children}</main>
            <Footer />
        </>
    );
};
