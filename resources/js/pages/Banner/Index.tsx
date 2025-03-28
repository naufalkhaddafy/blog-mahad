import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReorderList from './Partials/ReoderList';
import UploadImageBanner from './Partials/UploadImageBanner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Banner',
        href: '/banner',
    },
];

export type BannerProps = {
    id: number;
    title: string;
    image: string;
    status: boolean | number;
    url?: string;
    order: number;
};
const Index = ({ banner }: { banner: BannerProps[] }) => {
    const { errors } = usePage().props;

    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectEditBanner, setSelectEditBanner] = useState<BannerProps | null>();
    const [listBanner, setListBanner] = useState<boolean>(true);

    const { data, setData, reset } = useForm({
        title: '',
        url: '',
        image: '',
        status: selectEditBanner?.status || (false as boolean | null),
    });

    useEffect(() => {
        setOpenForm(!!selectEditBanner);
        setListBanner(!selectEditBanner);
        setData({
            title: selectEditBanner?.title || '',
            url: selectEditBanner?.url || '',
            status: selectEditBanner?.status || false,
            image: selectEditBanner?.image || '',
        });
    }, [selectEditBanner, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeUrl =
            selectEditBanner !== null
                ? route('banner.update', selectEditBanner?.id)
                : route('banner.store');
        router.post(
            routeUrl,
            {
                _method: selectEditBanner !== null ? 'patch' : 'post',
                ...data,
            },
            {
                onSuccess: () => {
                    reset();
                    setOpenForm(false);
                    setListBanner(true);
                },
            },
        );
    };

    const handleOpenForm = async () => {
        await setSelectEditBanner(null);
        setOpenForm(!openForm);
        setListBanner(!listBanner);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banner" />
            <div className="rounded-xl px-4 py-6">
                <Heading title="Pengaturan Banner" description="Kelola banner disini" />
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
                                        <CirclePlus className="inline-block" /> Banner
                                    </>
                                )}
                            </Button>
                        </div>
                        {openForm && (
                            <form id="form-banner" onSubmit={submit}>
                                <div className="my-5 grid grid-cols-4 gap-5 rounded-lg border-1 p-5">
                                    <div className="col-span-4">
                                        <UploadImageBanner setData={setData} data={data.image} />
                                        <InputError className="mt-2" message={errors.image} />
                                    </div>
                                    <div className="col-span-4 lg:col-span-2">
                                        <div>
                                            <Label htmlFor="title">Judul </Label>
                                            <Input
                                                id="title"
                                                type="text"
                                                className="w-full"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="Masukan Judul"
                                            />
                                            <InputError className="mt-2" message={errors.title} />
                                        </div>
                                    </div>
                                    <div className="col-span-4 lg:col-span-2">
                                        <div>
                                            <Label htmlFor="url">Url (optional)</Label>
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
                                    </div>
                                    <div className="col-span-4">
                                        <Switch
                                            id="status-active"
                                            checked={data.status === true || data.status === 1}
                                            onCheckedChange={(checked) =>
                                                setData('status', checked ? true : false)
                                            }
                                        />
                                        <Label htmlFor="status-active">Active</Label>
                                        <InputError className="mt-2" message={errors.status} />
                                    </div>
                                    <div className="col-span-4">
                                        <Button type="submit">Simpan</Button>
                                    </div>
                                </div>
                            </form>
                        )}
                        {banner.length > 0
                            ? listBanner && (
                                  <ReorderList
                                      items={banner}
                                      selectedEditBanner={setSelectEditBanner}
                                  />
                              )
                            : 'Banner tidak ada, tambah banner sekarang juga'}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
