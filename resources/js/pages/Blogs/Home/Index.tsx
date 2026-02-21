import { CardGrid } from '@/components/blog/CardGrid';
import { CardList } from '@/components/blog/CardList';
import { CardNoImage } from '@/components/blog/CardNoImage';
import { EmptyPost } from '@/components/blog/EmptyPost';
import {
    SkeletonCardGrid,
    SkeletonCardList,
    SkeletonCardNoImage,
    SkeletonPoster,
} from '@/components/blog/SkeletonCards';
import { Container } from '@/components/Container';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import BlogLayout from '@/layouts/BlogLayout';
import { BannerProps } from '@/pages/Banner/Index';
import { PostProps } from '@/pages/Posts/Partials/Type';
import { QuranPromoModal } from '@/components/blog/QuranPromoModal';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Banner } from './Partials/Banner';

interface IndexProps {
    posts: PostProps[];
    jadwalKajian: PostProps[];
    qna: PostProps[];
    poster: PostProps[];
    banner: BannerProps[];
}

const Index = ({ posts, jadwalKajian, qna, poster, banner }: IndexProps) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Beranda">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
                <meta name="author" content="Kajian Islam Sangatta"></meta>
                <meta name="robots" content="index, follow"></meta>
                <meta
                    name="description"
                    content="Kajian Islam Sangatta, Kajian Islam Ilmiah, Belajar Islam, Al Quran, Hadits, Sesuai dengan Pemahaman Salaf"
                ></meta>
            </Head>
            <h1 className="sr-only">Kajian Islam Sangatta - kajianislamsangatta.com</h1>
            {banner.length > 0 && <Banner bannerData={banner} />}

            {/* Al-Quran Promo Modal */}
            <QuranPromoModal />

            {/* Top Rencent */}
            <Container>
                <div className="py-10 lg:py-15">
                    <ScrollReveal variant="fade-up">
                        <div className="flex items-center justify-between">
                            <h2 className="text-primary relative h-fit w-auto text-xl font-extrabold after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-[60px] after:rounded-2xl after:bg-green-500 after:content-[''] lg:text-2xl dark:text-green-600 dark:after:bg-green-400">
                                Artikel Terbaru
                            </h2>
                            <Button className="bg-primary text-white dark:bg-green-700" asChild>
                                <Link
                                    href={route('blog.list', {
                                        category: 'artikel',
                                    })}
                                >
                                    Lihat Lainnya <Send />
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>
                    <div className="py-10">
                        <div className="grid grid-cols-5 place-items-center gap-4 lg:grid-flow-col">
                            {isLoading ? (
                                <>
                                    <div className="col-span-5 row-span-3 h-full w-full lg:col-span-2">
                                        <SkeletonCardGrid />
                                    </div>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="col-span-5 w-full max-w-3xl xl:w-3xl">
                                            <SkeletonCardList />
                                        </div>
                                    ))}
                                </>
                            ) : posts.length > 0 ? (
                                posts.map((dataPost: PostProps, index: number) => {
                                    if (index + 1 == 1) {
                                        return (
                                            <div
                                                key={index}
                                                className="col-span-5 row-span-3 h-full w-full lg:col-span-2"
                                            >
                                            <ScrollReveal variant="fade-up" delay={0}>
                                                <Link
                                                    href={route('blog.show', {
                                                        post: dataPost.slug,
                                                    })}
                                                >
                                                    <CardGrid dataPost={dataPost} />
                                                </Link>
                                            </ScrollReveal>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={index}
                                                className="col-span-5 w-full max-w-3xl xl:w-3xl"
                                            >
                                                <ScrollReveal variant="fade-left" delay={index * 100}>
                                                    <Link
                                                        href={route('blog.show', {
                                                            post: dataPost.slug,
                                                        })}
                                                    >
                                                        <CardList dataPost={dataPost} />
                                                    </Link>
                                                </ScrollReveal>
                                            </div>
                                        );
                                    }
                                })
                            ) : (
                                <EmptyPost>Afwan artikel belum tersedia</EmptyPost>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
            {/* Top Rencent End*/}
            {/* Jadwal Kajian */}
            <section className="bg-gradient-to-b from-green-50 to-white py-10 lg:py-15 dark:from-green-950/30 dark:to-transparent">
                <Container>
                    <ScrollReveal variant="fade-right">
                        <div className="flex items-center justify-between">
                            <h2 className="text-primary relative flex items-center gap-3 text-xl font-extrabold after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-[60px] after:rounded-2xl after:bg-green-500 after:content-[''] lg:text-2xl dark:text-green-600 dark:after:bg-green-400">
                                <CalendarDays className="h-6 w-6 text-green-600 lg:h-7 lg:w-7 dark:text-green-400" />
                                Jadwal Kajian
                            </h2>
                            <Button className="bg-primary text-white dark:bg-green-700" asChild>
                                <Link
                                    href={route('blog.list', {
                                        category: 'info-taklim',
                                    })}
                                >
                                    Lihat Lainnya <Send />
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>
                    <div className="grid gap-4 py-10 lg:grid-cols-2">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <SkeletonCardList key={i} />
                            ))
                        ) : jadwalKajian.length > 0 ? (
                            jadwalKajian.map((item, index) => (
                                <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
                                    <Link
                                        href={route('blog.show', {
                                            post: item.slug,
                                        })}
                                    >
                                        <CardList dataPost={item} />
                                    </Link>
                                </ScrollReveal>
                            ))
                        ) : (
                            <EmptyPost>Afwan jadwal kajian belum tersedia</EmptyPost>
                        )}
                    </div>
                </Container>
            </section>
            {/* Jadwal Kajian End */}
            {/* Poster */}
            <section className="bg-primary py-15 text-center">
                <Container>
                    <ScrollReveal variant="zoom-in">
                        <h2 className="relative w-auto text-2xl font-extrabold text-green-50 after:absolute after:-bottom-3 after:left-1/2 after:h-1 after:w-[70px] after:-translate-x-1/2 after:rounded-2xl after:bg-green-500 after:content-['']">
                            Galeri Poster Dakwah
                        </h2>
                    </ScrollReveal>
                    <div className="py-15">
                        {isLoading ? (
                            <SkeletonPoster />
                        ) : poster.length > 0 ? (
                            <Swiper
                                pagination={{
                                    dynamicBullets: true,
                                    clickable: true,
                                }}
                                breakpoints={{
                                    0: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    1024: { slidesPerView: 4 },
                                }}
                                spaceBetween={30}
                                loop={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                modules={[Navigation, Pagination, EffectFade, Autoplay]}
                                className="h-auto w-full"
                            >
                                {poster.map((dataPoster, index) => (
                                    <SwiperSlide key={index}>
                                        <Link
                                            href={route('blog.show', {
                                                post: dataPoster.slug,
                                            })}
                                        >
                                            <div className="grid aspect-square cursor-pointer place-items-center justify-center overflow-hidden rounded-2xl bg-amber-200">
                                                <img
                                                    src={dataPoster.imageSrc}
                                                    alt={dataPoster.title}
                                                    loading="lazy"
                                                />
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <EmptyPost className="text-green-50">
                                Afwan poster belum tersedia
                            </EmptyPost>
                        )}
                    </div>
                </Container>
            </section>
            {/* Poster End */}
            {/* Question */}
            <section className="pt-15">
                <Container>
                    <ScrollReveal variant="fade-left">
                        <h2 className="text-primary relative h-fit w-fit text-2xl font-extrabold after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-[60px] after:rounded-2xl after:bg-green-500 after:content-[''] dark:text-green-600 dark:after:bg-green-400">
                            Problematika Ummat
                        </h2>
                    </ScrollReveal>
                    <div className="grid gap-4 py-10 lg:grid-cols-2">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <SkeletonCardNoImage key={i} />
                            ))
                        ) : qna.length > 0 ? (
                            qna.map((qna, index) => (
                                <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
                                    <Link
                                        href={route('blog.show', {
                                            post: qna.slug,
                                        })}
                                    >
                                        <CardNoImage dataPost={qna} />
                                    </Link>
                                </ScrollReveal>
                            ))
                        ) : (
                            <EmptyPost>Afwan postingan belum tersedia</EmptyPost>
                        )}
                    </div>
                    <div className="w-full pb-15 text-center">
                        <Button className="bg-primary text-white dark:bg-green-700" asChild>
                            <Link
                                href={route('blog.list', {
                                    category: 'tanya-jawab',
                                })}
                            >
                                Lihat Lainnya <Send />
                            </Link>
                        </Button>
                    </div>
                    <ScrollReveal variant="fade-up">
                        <div className="bg-primary flex w-full items-center justify-between rounded-t-xl px-6 py-7 lg:px-10 lg:py-15">
                            <h3 className="font-sans text-xl font-bold text-white lg:text-4xl">
                                Ada hal yang ingin ditanyakan?
                            </h3>
                            <Button className="cursor-pointer rounded-4xl border-2 border-white bg-transparent py-6 font-semibold transition-all duration-400 hover:-translate-y-2 hover:bg-white hover:text-green-600 lg:px-9 lg:py-7 lg:text-xl dark:text-white dark:hover:text-green-600">
                                Tanya Asatidz
                            </Button>
                        </div>
                    </ScrollReveal>
                </Container>
            </section>
            {/* Question End*/}
        </>
    );
};

export default Index;

Index.layout = (page: React.ReactNode) => <BlogLayout children={page} />;
