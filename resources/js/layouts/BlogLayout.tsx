import { Footer } from '@/components/blog/Footer';
import { Navbar } from '@/components/blog/Navbar';
import { ScrollUp } from '@/components/blog/ScrollUp';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@/components/Container';
import { BreadcrumbItem } from '@/types';

const BlogLayout = ({
    children,
    breadcrumbs = [],
}: {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}) => {
    return (
        <>
            <header className="m-0 mb-4 bg-green-700 text-white shadow-2xl">
                <div></div>
                <Navbar />
            </header>
            <main>
                <Container className="max-w-5xl py-3">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </Container>
                {children}
            </main>
            <Footer />
            <ScrollUp />
        </>
    );
};

export default BlogLayout;
