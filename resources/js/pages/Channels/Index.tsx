import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { channelParams } from '@/hooks/useRadio';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, LoaderCircle, Minus, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ModalDeleteChannel } from './Partials/ModalChannel';
import UploadImageChannel from './Partials/UploadImageChannel';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Channel Radio',
        href: '/channels',
    },
];

const Index = ({ channels }: { channels: channelParams[] }) => {
    const { errors } = usePage().props;

    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectEditChannel, setSelectEditChannel] = useState<channelParams | null>(null);
    const [listChannel, setListChannel] = useState<boolean>(true);
    const [processing, setProcessing] = useState<boolean>(false);

    const handleOpenForm = async () => {
        await setSelectEditChannel(null);
        setOpenForm(!openForm);
        setListChannel(!listChannel);
    };
    const { data, setData, reset } = useForm({
        name: '',
        url: '',
        image: '',
        description: '',
        status: 'record',
    });

    useEffect(() => {
        setOpenForm(!!selectEditChannel);
        setListChannel(!selectEditChannel);
        setData({
            name: selectEditChannel?.name || '',
            url: selectEditChannel?.url || '',
            status: selectEditChannel?.status || 'record',
            image: selectEditChannel?.image || '',
            description: selectEditChannel?.description || '',
        });
    }, [selectEditChannel, setData]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeUrl =
            selectEditChannel !== null
                ? route('channels.update', selectEditChannel?.id)
                : route('channels.store');

        router.post(
            routeUrl,
            {
                _method: selectEditChannel !== null ? 'patch' : 'post',
                ...data,
            },
            {
                onStart: () => setProcessing(true),
                onSuccess: () => {
                    reset();
                    setOpenForm(false);
                    setListChannel(true);
                },
                onFinish: () => setProcessing(false),
            },
        );
    };
    const handleChannelActive = (id: number, status: string) => {
        router.post('/channels/change-status', { id: id, status: status });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Channel Radio" />
            <div className="rounded-xl px-4 py-6">
                <Heading
                    title="Pengaturan Channel Radio"
                    description="Kelola Channel Radio disini"
                />
                <div className="max-w-5xl">
                    <div className="w-full rounded-xl border p-4 shadow xl:col-span-4">
                        <div className="mb-10">
                            <Button
                                className="cursor-pointer bg-green-700 hover:border hover:border-green-600 hover:bg-white hover:text-green-600"
                                onClick={handleOpenForm}
                            >
                                {openForm ? (
                                    <>
                                        <Minus /> Hide Form
                                    </>
                                ) : (
                                    <>
                                        <CirclePlus className="inline-block" /> Channel
                                    </>
                                )}
                            </Button>
                        </div>

                        {openForm && (
                            <form id="form-banner" onSubmit={onSubmit}>
                                <div className="my-5 grid grid-cols-3 gap-5 rounded-lg border-1 p-5">
                                    <div className="col-span-3 lg:col-span-1">
                                        <div>
                                            <UploadImageChannel
                                                setData={setData}
                                                data={data.image}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <Label htmlFor="image">Link Image </Label>
                                            <Input
                                                id="image"
                                                type="text"
                                                className="w-full"
                                                value={data.image}
                                                onChange={(e) => setData('image', e.target.value)}
                                                placeholder="Masukan link gambar"
                                            />
                                            <InputError className="mt-2" message={errors.image} />
                                        </div>
                                    </div>
                                    <div className="col-span-3 grid h-fit gap-5 lg:col-span-2">
                                        <div>
                                            <Label htmlFor="name">Nama Channel</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                className="w-full"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Masukan nama channel"
                                            />
                                            <InputError className="mt-2" message={errors.name} />
                                        </div>
                                        <div>
                                            <Label htmlFor="url">Url</Label>
                                            <Input
                                                id="url"
                                                type="text"
                                                className="w-full"
                                                value={data.url}
                                                onChange={(e) => setData('url', e.target.value)}
                                                placeholder="Masukan Url https://..."
                                            />
                                            <InputError className="mt-2" message={errors.url} />
                                        </div>
                                        <div>
                                            <Label htmlFor="description">
                                                Deskripsi (optional)
                                            </Label>
                                            <Input
                                                id="description"
                                                type="text"
                                                className="w-full"
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData('description', e.target.value)
                                                }
                                                placeholder="Masukan deskripsi"
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={errors.description}
                                            />
                                        </div>

                                        <div>
                                            <Button type="submit" disabled={processing}>
                                                {processing && (
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                )}
                                                Simpan
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="grid gap-4">
                            {listChannel &&
                                channels.map((item, index) => (
                                    <Card
                                        key={index}
                                        className="custom-scrollbar w-full max-w-screen overflow-x-auto p-2 md:p-4"
                                    >
                                        <div className="flex items-center gap-1 md:gap-8">
                                            <div className="px-5">{index + 1}</div>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                loading="lazy"
                                                className="aspect-square w-25 rounded-lg"
                                            />
                                            <div className="flex items-center gap-2 px-5 md:hidden">
                                                <Switch
                                                    id="status-live"
                                                    defaultChecked={
                                                        item.status === 'live' ? true : false
                                                    }
                                                    onCheckedChange={(checked) =>
                                                        handleChannelActive(
                                                            item.id,
                                                            checked ? 'live' : `record`,
                                                        )
                                                    }
                                                />
                                                <Label htmlFor="status-live">Live</Label>
                                            </div>

                                            <div className="w-full min-w-56 px-5">
                                                <h3 className="text-md font-bold text-ellipsis">
                                                    {item.name}
                                                </h3>
                                                <a
                                                    href={item.url || ''}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <div className="py-2 text-sm text-blue-600 underline">
                                                        {item.url}
                                                    </div>
                                                </a>
                                                <div className="text-sm">{item.description}</div>
                                            </div>
                                            <div className="hidden items-center gap-2 md:flex">
                                                <Switch
                                                    id="status-live"
                                                    defaultChecked={
                                                        item.status === 'live' ? true : false
                                                    }
                                                    onCheckedChange={(checked) =>
                                                        handleChannelActive(
                                                            item.id,
                                                            checked ? 'live' : `record`,
                                                        )
                                                    }
                                                />
                                                <Label htmlFor="status-live">Live</Label>
                                            </div>
                                            <div className="mx-8 flex items-center gap-2 lg:mx-0">
                                                <Switch
                                                    id="status-active"
                                                    defaultChecked={
                                                        item.status !== 'unactive' ? true : false
                                                    }
                                                    onCheckedChange={(checked) =>
                                                        handleChannelActive(
                                                            item.id,
                                                            checked ? 'record' : 'unactive',
                                                        )
                                                    }
                                                />
                                                <Label htmlFor="status-active">Aktif Siaran</Label>
                                            </div>
                                            <div className="p-5">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <button
                                                                className="w-full"
                                                                onClick={() =>
                                                                    setSelectEditChannel(item)
                                                                }
                                                            >
                                                                Edit
                                                            </button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <ModalDeleteChannel channel={item} />
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
