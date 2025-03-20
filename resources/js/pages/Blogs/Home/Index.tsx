import Badge from '@/components/blog/Badge';
import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BlogLayout from '@/layouts/BlogLayout';
import { getLimitTextContent } from '@/lib/utils';
import { PostProps } from '@/pages/Posts/Partials/Type';
import { Head, Link } from '@inertiajs/react';
import { Clock, Send } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Banner } from './Partials/Banner';

interface IndexProps {
    posts: PostProps[];
    qna: PostProps[];
    poster: PostProps[];
}

const Index = ({ posts, qna, poster }: IndexProps) => {
    return (
        <BlogLayout>
            <Head title="Beranda">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <Banner />
            {/* Top Rencent */}
            <Container>
                <section className="py-15">
                    <div className="flex items-center justify-between">
                        <h1 className="relative h-fit w-auto text-xl font-extrabold text-green-700 after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-[60px] after:rounded-2xl after:bg-green-500 after:content-[''] lg:text-2xl">
                            Artikel Terbaru
                        </h1>
                        <Button className="bg-green-600" asChild>
                            <Link
                                href={route('blog.list', {
                                    category: 1,
                                })}
                            >
                                Lihat Lainnya <Send />
                            </Link>
                        </Button>
                    </div>
                    <div className="py-10">
                        <div className="grid grid-cols-5 place-items-center gap-4 lg:grid-flow-col">
                            {posts.length > 0 ? (
                                posts.map((dataPost: PostProps, index: number) => {
                                    if (index + 1 == 1) {
                                        return (
                                            <div
                                                key={index}
                                                className="col-span-5 row-span-3 h-full w-full lg:col-span-2"
                                            >
                                                <Link
                                                    href={route('blog.show', {
                                                        post: dataPost.slug,
                                                    })}
                                                >
                                                    <Card className="group relative flex h-full w-full cursor-pointer flex-col gap-0 overflow-hidden bg-green-100/50 p-0">
                                                        <img
                                                            src={dataPost.imageSrc}
                                                            alt={dataPost.title}
                                                            className="aspect-video object-fill brightness-100 transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="flex h-full w-full flex-col justify-center rounded-t-lg bg-green-100/50 p-5 text-left text-black backdrop-blur-md lg:px-10 lg:py-6">
                                                            <div className="flex items-center gap-2 pb-1 text-xs font-extralight text-green-900 lg:text-sm">
                                                                <Clock className="size-4" />
                                                                {dataPost.created_at}
                                                            </div>
                                                            <h1 className="text-md font-bold lg:py-6 lg:text-xl">
                                                                {getLimitTextContent(
                                                                    dataPost.title,
                                                                    100,
                                                                )}
                                                            </h1>
                                                            <p className="text-xs lg:text-lg">
                                                                {getLimitTextContent(
                                                                    dataPost.description,
                                                                    100,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="absolute top-0 left-0 flex flex-wrap gap-2 px-4 py-5 lg:px-6">
                                                            <Badge>{dataPost.category?.name}</Badge>
                                                            {dataPost.tags.map(
                                                                (dataTags, index) => (
                                                                    <Badge key={index}>
                                                                        {dataTags.label}
                                                                    </Badge>
                                                                ),
                                                            )}
                                                        </div>
                                                    </Card>
                                                </Link>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={index}
                                                className="col-span-5 w-full max-w-3xl xl:w-3xl"
                                            >
                                                <Link
                                                    href={route('blog.show', {
                                                        post: dataPost.slug,
                                                    })}
                                                >
                                                    <Card className="group grid w-full cursor-pointer grid-cols-6 gap-3 overflow-hidden bg-green-100/50 p-2 lg:gap-5">
                                                        <div className="col-span-2 my-auto h-24 w-full overflow-hidden rounded-xl md:h-32 lg:h-34">
                                                            <img
                                                                src={dataPost.imageSrc}
                                                                alt={dataPost.title}
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                            />
                                                        </div>
                                                        <div className="col-span-4 py-2">
                                                            <div className="hidden items-center gap-1 py-1 md:flex">
                                                                <Badge>
                                                                    {dataPost.category?.name}
                                                                </Badge>
                                                                {dataPost.tags.map(
                                                                    (dataTags, index) => (
                                                                        <Badge key={index}>
                                                                            {dataTags.label}
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            </div>
                                                            <h3 className="text-md text-left font-bold lg:text-lg">
                                                                {dataPost.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 py-2 text-xs font-extralight text-gray-600">
                                                                <Clock className="size-4" />
                                                                {dataPost.created_at}
                                                            </div>

                                                            <p className="hidden font-sans text-sm font-extralight md:block">
                                                                {getLimitTextContent(
                                                                    dataPost.description,
                                                                    70,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </Card>
                                                </Link>
                                            </div>
                                        );
                                    }
                                })
                            ) : (
                                <div className="col-span-5 text-lg">
                                    Mohon maaf artikel belum tersedia
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </Container>
            {/* Top Rencent End*/}
            {/* Poster */}
            <section className="bg-green-700 py-15 text-center">
                <Container>
                    <h1 className="relative w-auto text-2xl font-extrabold text-green-50 after:absolute after:-bottom-3 after:left-1/2 after:h-1 after:w-[70px] after:-translate-x-1/2 after:rounded-2xl after:bg-green-500 after:content-['']">
                        Galeri Poster Dakwah
                    </h1>
                    <div className="py-15">
                        {poster.length > 0 ? (
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
                                                />
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="col-span-5 text-sm text-green-50 lg:text-lg">
                                Mohon maaf poster belum tersedia
                            </div>
                        )}
                    </div>
                </Container>
            </section>
            {/* Poster End */}
            {/* Question */}
            <section className="pt-15">
                <Container>
                    <h1 className="relative h-fit w-fit text-2xl font-extrabold text-green-700 after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-[60px] after:rounded-2xl after:bg-green-500 after:content-['']">
                        Problematika Ummat
                    </h1>
                    <div className="grid gap-4 py-10 lg:grid-cols-2">
                        {qna.length > 0 ? (
                            qna.map((qna, index) => (
                                <Card
                                    key={index + 1}
                                    className="group cursor-pointer p-4 transition-all duration-200 hover:scale-102 hover:border-green-600"
                                >
                                    <Link
                                        href={route('blog.show', {
                                            post: qna.slug,
                                        })}
                                    >
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 px-1 py-2">
                                                <Badge>{qna.category?.name}</Badge>
                                                {qna.tags.map((data, index) => (
                                                    <Badge key={index}>{data.label}</Badge>
                                                ))}
                                            </div>
                                            <h1 className="text-lg font-semibold">{qna.title}</h1>
                                            <span className="flex items-center gap-2 py-1 text-sm text-gray-400">
                                                <Clock className="size-4" /> {qna.created_at}
                                            </span>
                                            <p className="text-justify">
                                                {getLimitTextContent(qna.description, 150)}
                                            </p>
                                        </div>
                                    </Link>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-5 text-lg">
                                Mohon maaf postingan belum tersedia
                            </div>
                        )}
                    </div>
                    <div className="w-full pb-15 text-center">
                        <Button className="bg-green-600" asChild>
                            <Link
                                href={route('blog.list', {
                                    category: 2,
                                })}
                            >
                                Lihat Lainnya <Send />
                            </Link>
                        </Button>
                    </div>
                    <div className="flex w-full items-center justify-between rounded-t-xl bg-green-600 px-6 py-7 lg:px-10 lg:py-15">
                        <h3 className="font-sans text-xl font-bold text-white lg:text-4xl">
                            Ada hal yang ingin ditanyakan?
                        </h3>
                        <Button className="cursor-pointer rounded-4xl border-2 border-white bg-transparent py-6 font-semibold transition-all duration-400 hover:-translate-y-2 hover:bg-white hover:text-green-600 lg:px-9 lg:py-7 lg:text-xl">
                            Tanya Asatidz
                        </Button>
                    </div>
                </Container>
            </section>
            {/* Question End*/}
        </BlogLayout>
    );
};

export default Index;
