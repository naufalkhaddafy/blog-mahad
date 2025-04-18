import { ContentBottomFix } from '@/components/blog/ContentBottomFix';
import { Footer } from '@/components/blog/Footer';
import { Navbar } from '@/components/blog/Navbar';
import NotifLive from '@/components/blog/NotifLive';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Container } from '@/components/Container';
import { BookmarkProvider } from '@/hooks/useBookmark';
import { RadioProvider } from '@/hooks/useRadio';
import { BreadcrumbItem } from '@/types';

const BlogLayout = ({
    children,
    breadcrumbs = [],
}: {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}) => {
    return (
        <main className="relative">
            <BookmarkProvider>
                <RadioProvider>
                    <header className="bg-primary sticky top-0 z-20 m-0 mb-4 text-white shadow-xl">
                        <NotifLive />
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
