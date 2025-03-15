import { Footer } from '@/components/blog/Footer';
import { Navbar } from '@/components/blog/Navbar';

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
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

export default BlogLayout;
