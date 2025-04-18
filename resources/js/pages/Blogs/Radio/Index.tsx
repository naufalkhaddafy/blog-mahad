import { Container } from '@/components/Container';
import { Card } from '@/components/ui/card';
import useRadio, { channelParams } from '@/hooks/useRadio';
import BlogLayout from '@/layouts/BlogLayout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCheck, Dot, Headphones, Share2 } from 'lucide-react';
import React, { useState } from 'react';

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

const Index = ({ channels }: { channels: channelParams[] }) => {
    const { setChannelPlay } = useRadio();
    const [copy, setCopy] = useState<{ [key: string]: boolean }>({});

    const copyToClipboard = (channelId: number) => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopy({ ...copy, [channelId]: true });
        setTimeout(() => {
            setCopy({ ...copy, [channelId]: false });
        }, 2000);
    };

    return (
        <>
            <Head title="Radio Islam Sangatta">
                <meta name="author" content="Kajian Islam Sangatta"></meta>
                <meta name="robots" content="index, follow"></meta>
                <meta
                    name="description"
                    content="Kajian Islam Sangatta, Media belajar untuk memperdalam pemahaman tentang Al-Qur'an, Hadits, dan ajaran Islam sesuai dengan pemahaman Salaf! - kajianislamsangatta.com"
                ></meta>
            </Head>
            <Container className="min-h-screen max-w-5xl">
                <header className="border-b-2 py-10">
                    <h1 className="sr-only">{'Radio Islam Sangatta'}</h1>
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
                </header>
                <section className="py-10">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {channels.map((channel, index) => (
                            <Card
                                className="p-5"
                                key={index}
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
                        ))}
                    </div>
                </section>
            </Container>
        </>
    );
};
export default Index;

Index.layout = (page: React.ReactNode) => <BlogLayout breadcrumbs={breadcrumbs} children={page} />;
