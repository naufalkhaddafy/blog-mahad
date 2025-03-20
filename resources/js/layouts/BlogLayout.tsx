import { Footer } from '@/components/blog/Footer';
import { Navbar } from '@/components/blog/Navbar';
import { ScrollUp } from '@/components/blog/ScrollUp';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@/components/Container';
import { BreadcrumbItem } from '@/types';

const BlogLayout = ({
    children,
    breadcrumbs = [],
    radio = false,
}: {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    radio?: boolean;
}) => {
    return (
        <main className="relative">
            <header className="sticky top-0 z-20 m-0 mb-4 bg-green-700 text-white shadow-xl">
                {radio && (
                    <div className="m-0 bg-gray-600">
                        <Container>Radio</Container>
                    </div>
                )}
                <Navbar />
            </header>
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <section className="pt-2 lg:pb-2">
                    <Container className="max-w-5xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </Container>
                </section>
            )}
            {/* Konten Utama */}
            <section className="content-container">{children}</section>
            <Footer />
            <ScrollUp />
        </main>
    );
};

export default BlogLayout;
