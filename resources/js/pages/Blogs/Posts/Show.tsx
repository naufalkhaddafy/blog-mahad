import Badge from '@/components/blog/Badge';
import SocialMediaShare from '@/components/blog/SocialMediaShare';

import { Container } from '@/components/Container';
import { Card } from '@/components/ui/card';
import useScroll from '@/hooks/useScroll';
import BlogLayout from '@/layouts/BlogLayout';
import { getLimitTextContent } from '@/lib/utils';
import { PostProps } from '@/pages/Posts/Partials/Type';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BookmarkPlus,
    ChartLine,
    CircleSmall,
    CircleUserRound,
    Clock,
    Share2,
} from 'lucide-react';
import { useRef } from 'react';

interface ShowProps {
    post: PostProps;
    previousPost?: PostProps | null;
    nextPost?: PostProps | null;
    relevantPosts: PostProps[];
}

const Show = ({ post, previousPost, nextPost, relevantPosts }: ShowProps) => {
    const shareUrl = window.location.href;
    const articleRef = useRef<HTMLElement | null>(null);
    const { completion, progress } = useScroll(articleRef);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Beranda',
            href: '/',
        },
        {
            title: 'Belajar Islam',
            href: route('blog.list', { category: post.category?.id }),
        },
        {
            title: `${post.category?.name}`,
            href: '/posts',
        },
    ];
    return (
        <BlogLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title}>
                <meta
                    name="description"
                    content={`${getLimitTextContent(post.description, 200)}`}
                />
                <meta name="author" content="Kajian Islam Sangatta" />
                <meta property="og:title" content={`${post.title} - kajianislamsangatta.com`} />
                <meta
                    property="og:description"
                    content={`${getLimitTextContent(post.description, 200)}`}
                />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:site_name" content="kajianislamsangatta.com" />
                <meta property="og:image" content={post.imageSrc} />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="451" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:type" content="image/png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${post.title} - kajianislamsangatta.com`} />
                <meta
                    name="twitter:description"
                    content={`${getLimitTextContent(post.description, 200)}`}
                />
                <meta name="twitter:image" content={post.imageSrc} />
                <link rel="canonical" href={shareUrl} />
            </Head>
            <div
                className={`${progress ? 'fixed' : 'hidden'} top-0 z-30 m-0 w-full bg-gray-300 transition-all duration-900`}
            >
                <div
                    style={{ width: `${completion}%` }}
                    className="h-1 rounded-sm bg-green-700 transition-normal lg:h-1.5"
                />
            </div>
            <Container className="max-w-5xl py-5">
                <article ref={articleRef} className="h-auto">
                    <header className="py-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge>{post.category?.name}</Badge>
                            {post.tags.map((dataTags, index) => (
                                <Badge key={index + 1}>{dataTags.label}</Badge>
                            ))}
                        </div>
                        <h1 className="py-8 text-2xl font-bold lg:text-5xl"> {post.title}</h1>
                        <div className="mb-5 flex items-center justify-between gap-2 border-y-1 px-3 py-3 font-medium lg:px-1">
                            <div className="flex items-center gap-2 font-medium">
                                <div className="flex items-center gap-1">
                                    <CircleUserRound size={15} />
                                    <p className="text-sm">{post.user?.name}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 lg:text-sm">
                                    <span className="text-gray-700">
                                        <CircleSmall size={8} />
                                    </span>
                                    {post.created_at}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-sm">
                                    <ChartLine className="size-4 text-gray-500 lg:size-5" />
                                    <p className="text-sm text-green-500">{post.views}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookmarkPlus className="size-5 text-green-800 lg:size-6" />
                                    {/* <BookmarkCheck className="size-4 lg:size-5" /> */}
                                </div>
                            </div>
                        </div>
                    </header>

                    <figure className="w-full">
                        <img
                            src={post.imageSrc}
                            alt={post.title}
                            className={`${post.category?.name == 'Poster' ? 'aspect-square' : 'aspect-video'} w-full rounded-lg`}
                            loading="lazy"
                        />
                    </figure>
                    <section className="py-5">
                        <div
                            dangerouslySetInnerHTML={{ __html: post.description }}
                            className="overflow-hidden"
                        />
                    </section>
                    <footer className="py-5">
                        <div className="flex items-center gap-2 border-y-1 py-3 font-medium lg:gap-5">
                            <div className="flex items-center gap-2">
                                <Share2 className="size-4 lg:size-5" />
                                <p className="text-sm lg:text-lg">Share</p>
                            </div>
                            <SocialMediaShare post={post} />
                        </div>
                    </footer>
                </article>

                <section className="my-5 grid grid-cols-2 gap-5 rounded-lg border-1 p-2">
                    {previousPost ? (
                        <Link
                            href={route('blog.show', {
                                post: previousPost.slug,
                            })}
                            className="col-span-2 lg:col-span-1"
                        >
                            <div className="col-span-2 flex h-full items-center justify-start gap-2 rounded-lg p-2 transition-all duration-300 hover:border-1 hover:border-green-500 lg:col-span-1">
                                <span>
                                    <ArrowLeft />
                                </span>
                                <h2 className="text-md">{previousPost?.title}</h2>
                            </div>
                        </Link>
                    ) : (
                        ''
                    )}
                    {nextPost ? (
                        <Link
                            href={route('blog.show', {
                                post: nextPost?.slug,
                            })}
                            className="col-span-2 lg:col-span-1"
                        >
                            <div className="col-span-2 flex h-full items-center justify-end gap-2 rounded-lg p-2 transition-all duration-300 hover:border-1 hover:border-green-500 lg:col-span-1">
                                <h2 className="text-md">{nextPost?.title}</h2>
                                <span>
                                    <ArrowRight />
                                </span>
                            </div>
                        </Link>
                    ) : (
                        ''
                    )}
                </section>
                {/* Artikel Terkait */}
                <section className="py-10">
                    <h2 className="relative h-fit w-auto text-xl font-extrabold text-green-700 after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-[60px] after:rounded-2xl after:bg-green-500 after:content-[''] lg:text-2xl">
                        Artikel Terkait
                    </h2>
                    <div className="grid gap-5 py-10">
                        {relevantPosts.length > 0
                            ? relevantPosts.map((relevantPost, index) => (
                                  <Link
                                      key={index + 1}
                                      href={route('blog.show', {
                                          post: relevantPost.slug,
                                      })}
                                  >
                                      <Card className="group grid w-full cursor-pointer grid-cols-6 gap-3 overflow-hidden bg-green-100/50 p-2 lg:gap-5">
                                          <div className="col-span-2 my-auto h-24 w-full overflow-hidden rounded-xl bg-amber-400 md:h-32 lg:h-34">
                                              <img
                                                  src={relevantPost.imageSrc}
                                                  alt={relevantPost.title}
                                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                  loading="lazy"
                                              />
                                          </div>
                                          <div className="col-span-4 py-2">
                                              <div className="hidden items-center gap-1 py-1 md:flex">
                                                  <Badge>{relevantPost.category?.name}</Badge>
                                                  {relevantPost.tags.map((dataTags, index) => (
                                                      <Badge key={index}>{dataTags.label}</Badge>
                                                  ))}
                                              </div>
                                              <h3 className="text-md text-left font-bold lg:text-lg">
                                                  {relevantPost.title}
                                              </h3>
                                              <div className="flex items-center gap-2 py-2 text-xs font-extralight text-gray-600">
                                                  <Clock className="size-4" />
                                                  {relevantPost.created_at}
                                              </div>

                                              <p className="hidden font-sans text-sm font-extralight md:block">
                                                  {getLimitTextContent(
                                                      relevantPost.description,
                                                      70,
                                                  )}
                                              </p>
                                          </div>
                                      </Card>
                                  </Link>
                              ))
                            : ''}
                    </div>
                </section>
            </Container>
        </BlogLayout>
    );
};

export default Show;
