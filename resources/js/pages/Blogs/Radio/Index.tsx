import { QuranPromoModal } from '@/components/blog/QuranPromoModal';
import { Container } from '@/components/Container';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SkeletonRadioCard } from '@/components/blog/SkeletonCards';
import { Card } from '@/components/ui/card';
import useRadio, { channelParams } from '@/hooks/useRadio';
import BlogLayout from '@/layouts/BlogLayout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCheck, Dot, Headphones, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda',
        href: '/',
    },
    {
        title: 'Radio Online',
        href: '',
    },
];

const Index = ({ channels: initiateChannels }: { channels: channelParams[] }) => {
    const { setChannelPlay } = useRadio();
    const [copy, setCopy] = useState<{ [key: string]: boolean }>({});
    const [channels, setChannels] = useState<channelParams[]>(initiateChannels);
    const [isLoading, setIsLoading] = useState(true);
    // Initialize Laravel Echo for real-time updates
    useEffect(() => {
        window.Echo.channel('radio-update').listen('.RadioUpdate', (e: any) => {
            setChannels((prevChannels) => {
                return prevChannels.map((channel) => {
                    if (channel.id === e.data.id) {
                        // Kalau id sama, update dengan data baru
                        return { ...channel, ...e.data };
                    }
                    return channel; // kalau id beda, kembalikan channel asli
                });
            });
        });
        return () => {
            window.Echo.leave('radio-update');
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const copyToClipboard = (channelId: number) => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopy({ ...copy, [channelId]: true });
        setTimeout(() => {
            setCopy({ [channelId]: false });
        }, 2000);
    };

    return (
        <>
            <QuranPromoModal />
            <Head title="Radio Islam Sangatta">
                <meta name="author" content="Kajian Islam Sangatta"></meta>
                <meta name="robots" content="index, follow"></meta>
                <meta
                    name="description"
                    content="Kajian Islam Sangatta, Media belajar untuk memperdalam pemahaman tentang Al-Qur'an, Hadits, dan ajaran Islam sesuai dengan pemahaman Salaf! - kajianislamsangatta.com"
                ></meta>
            </Head>
            <Container className="max-w-5xl">
                <header className="border-b-2 py-10">
                    <h1 className="sr-only">{'Radio Islam Sangatta'}</h1>
                    <ScrollReveal variant="fade-up">
                        <div className="flex flex-wrap items-center justify-between gap-5">
                            <div>
                                <h2 className="text-primary text-2xl font-bold lg:text-3xl dark:text-green-600">
                                    Radio Islam Sangatta
                                </h2>
                                <p className="flex items-center text-sm text-gray-500 lg:text-lg">
                                    Mendengarkan Kajian Islam Ilmiah
                                    <span aria-hidden="true">
                                        <Dot className="size-8 animate-pulse text-green-700 dark:text-green-400" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </header>
                <section className="relative min-h-screen py-10">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <SkeletonRadioCard key={i} />
                              ))
                            : channels.map((channel, index) => (
                                  <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
                                      <Card
                                          className="p-5"
                                          onClick={() => setChannelPlay(channel)}
                                      >
                                      <div>
                                          <div className="flex gap-5">
                                              <img
                                                  src={channel.image}
                                                  className="aspect-square w-15"
                                                  alt={channel.name}
                                              />
                                              <div>
                                                  <div className="flex items-center gap-4">
                                                      <h3 className="font-bold">{channel.name}</h3>
                                                      {channel.status === 'live' ? (
                                                          <span className="flex animate-pulse items-center rounded-2xl bg-red-700 px-2 py-1 text-xs text-white">
                                                              Live
                                                          </span>
                                                      ) : (
                                                          ''
                                                      )}
                                                  </div>
                                                  <p className="flex items-center gap-3">
                                                      <Headphones className="size-4 lg:size-5" />{' '}
                                                      {channel.stats?.listeners}
                                                  </p>
                                              </div>
                                          </div>
                                          <p className="py-4">{channel.stats?.description}</p>
                                          <div className="flex items-center gap-4">
                                              {/* <Bookmark className="size-4 lg:size-5" /> */}
                                              {copy[channel.id] ? (
                                                  <span className="flex items-center gap-1 text-xs font-semibold text-green-700 antialiased dark:text-green-400">
                                                      <CheckCheck className="size-4" />
                                                      copied on clipboard
                                                  </span>
                                              ) : (
                                                  <Share2
                                                      className="size-4 cursor-pointer transition-all duration-300 hover:scale-125 lg:size-5"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          copyToClipboard(channel.id);
                                                      }}
                                                  />
                                              )}
                                          </div>
                                      </div>
                                  </Card>
                                  </ScrollReveal>
                              ))}
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 flex justify-center">
                    <ScrollReveal variant="fade-up">
                        <div className="mx-auto flex w-full flex-col items-center gap-4 rounded-t-2xl bg-green-700 p-6 lg:flex-row lg:justify-between lg:p-10 dark:bg-gray-800">
                            <h2 className="text-md text-center font-semibold text-white lg:text-xl dark:text-white">
                                Dapatkan informasi siaran langsung
                            </h2>
                            <a
                                href="https://whatsapp.com/channel/0029Vb6el0O6WaKuf6lIDo32"
                                target="_blank"
                                rel="noreferrer"
                                className="text-md relative flex cursor-pointer items-center gap-2 rounded-full bg-red-600 px-4 py-2 font-medium text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:bg-red-700 lg:px-6 lg:py-3"
                            >
                                <span className="absolute top-3.5 left-5.5 h-3 w-3 animate-ping rounded-full bg-red-100 lg:top-5 lg:left-7"></span>
                                🔴 Gabung disini
                            </a>
                        </div>
                    </ScrollReveal>
                    </div>
                </section>
            </Container>
        </>
    );
};
export default Index;

Index.layout = (page: React.ReactNode) => <BlogLayout breadcrumbs={breadcrumbs} children={page} />;
