import { ContentBottomFix } from '@/components/blog/ContentBottomFix';
import { Footer } from '@/components/blog/Footer';
import { Navbar } from '@/components/blog/Navbar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@/components/Container';
import { BookmarkProvider } from '@/hooks/useBookmark';
import { RadioProvider } from '@/hooks/useRadio';
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
            <BookmarkProvider>
                <RadioProvider>
                    <header className="bg-primary sticky top-0 z-20 m-0 mb-4 text-white shadow-xl">
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
                    <ContentBottomFix />
                </RadioProvider>
            </BookmarkProvider>
        </main>
    );
};

export default BlogLayout;
