import { useAppearance } from '@/hooks/use-appearance';
import useBookmark from '@/hooks/useBookmark';
import { asset, getLimitTextContent } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Bookmark, BookOpenText, ChevronDown, Menu, Moon, Search, Sun, Trash } from 'lucide-react';
import { useState } from 'react';
import { Container } from '../Container';
import { Button } from '../ui/button';
import { EmptyPost } from './EmptyPost';

const dataNav = [
    {
        name: 'Beranda',
        url: '/',
        submenu: [],
        isNew: false,
    },
    {
        name: 'Info Mahad',
        url: '',
        submenu: [
            { name: 'Info Mahad', url: route('blog.list', { category: 'info-mahad' }) },
            { name: 'Kontak', url: '' },
        ],
        isNew: false,
    },
    {
        name: 'Info Kajian',
        url: '',
        submenu: [
            { name: 'Info Taklim', url: route('blog.list', { category: 'info-taklim' }) },
            { name: 'Info Dauroh', url: route('blog.list', { category: 'info-dauroh' }) },
        ],
        isNew: false,
    },
    {
        name: 'Belajar Islam',
        url: '/belajar-islam',
        submenu: [],
        isNew: false,
    },
    {
        name: 'Radio Online',
        url: '/radio-online',
        submenu: [],
        isNew: false,
    },
    {
        name: 'Al-Quran',
        url: '/al-quran',
        submenu: [],
        isNew: true,
    },
];

export const Navbar = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const { appearance, updateAppearance } = useAppearance();
    const [openBookmark, setOpenBookmark] = useState<boolean>(false);

    const { bookmarks, removeBoomark } = useBookmark();

    return (
        <Container className="px-3 py-4 xl:py-3">
            <nav className="bg-primary flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        data-slot="button"
                        className="cursor-pointer lg:hidden"
                        onClick={() => {
                            setOpen(!open);
                            setOpenBookmark(false);
                        }}
                    >
                        <Menu className="size-5 cursor-pointer transition duration-300 hover:text-green-500" />
                    </button>
                    <Link href="/">
                        <div className="flex items-center gap-2 lg:gap-4">
                            <img
                                src={asset('assets/kis-icon.png')}
                                alt="Kajian Islam Sangatta Icon"
                                className="aspect-square size-8 lg:size-14"
                                loading="lazy"
                            />
                            <div className="flex flex-col">
                                <h5 className="text-sm font-semibold xl:text-xl">
                                    Kajian Islam Sangatta
                                </h5>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex">
                    <ul className="flex w-full items-center gap-2">
                        {dataNav.map((data, index) => (
                            <li
                                key={index}
                                className="group relative flex cursor-pointer items-center gap-1 rounded-md px-2 py-2 text-sm font-semibold transition-normal duration-500 ease-in-out hover:bg-green-800/50"
                                onClick={() =>
                                    setActiveDropdown(activeDropdown === index ? null : index)
                                }
                                onMouseEnter={() => setActiveDropdown(index)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={data.url}
                                    onClick={(e) => {
                                        if (!data.url) e.preventDefault();
                                    }}
                                    className="flex items-center gap-1.5"
                                >
                                    {data.name}
                                    {data.isNew && (
                                        <span className="relative flex items-center">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                                                NEW
                                            </span>
                                        </span>
                                    )}
                                </Link>

                                {data.submenu.length > 0 && (
                                    <>
                                        <ChevronDown
                                            size={20}
                                            className={`${activeDropdown === index ? 'rotate-180' : ''} group-hover: transition-all duration-300`}
                                        />
                                        {/* Dropdown */}
                                        <div
                                            className={`absolute top-12 left-0 z-10 w-48 flex-col overflow-hidden rounded-md bg-white shadow-lg transition-all duration-500 ${
                                                activeDropdown === index
                                                    ? 'max-h-screen'
                                                    : 'max-h-0'
                                            }`}
                                        >
                                            {data.submenu.map((sub, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    href={sub.url}
                                                    className="block px-4 py-2 text-black hover:bg-gray-200 hover:text-green-700"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* BookMark  */}
                <div className="flex items-center gap-3 lg:gap-4">
                    <Link href="/belajar-islam" aria-label="Belajar Islam - kajiansangatta.com">
                        <Search className="size-5 cursor-pointer transition duration-300 hover:text-green-500 active:text-green-500 lg:size-6" />
                    </Link>
                    <div className="relative">
                        <div
                            onClick={() => setOpenBookmark(!openBookmark)}
                            className="cursor-pointer"
                        >
                            <Bookmark
                                className={`size-5 cursor-pointer transition duration-300 hover:text-green-500 active:text-green-500 lg:size-6`}
                            />
                            {bookmarks.length > 0 && (
                                <span className="absolute -top-1.5 -right-1 rounded-full bg-gray-200/100 px-1 text-xs text-green-800">
                                    {bookmarks.length}
                                </span>
                            )}
                        </div>
                        {openBookmark && (
                            <>
                                <div
                                    className="fixed inset-0 h-full w-full bg-gray-500/50 md:bg-transparent"
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            setOpenBookmark(false);
                                        }
                                    }}
                                ></div>
                                <div className="fixed top-18 right-1/2 w-[97vw] translate-x-1/2 rounded-lg border-1 bg-white px-2 py-3 opacity-100 shadow-2xl transition-all transition-discrete duration-500 md:absolute md:top-15 md:-right-1 md:w-[600px] md:translate-x-0 md:p-4 dark:bg-gray-800 starting:opacity-0">
                                    <div className="grid gap-3 overflow-hidden">
                                        <span className="text-primary flex items-center justify-between rounded-3xl p-1 text-sm font-bold md:p-3 dark:text-green-500">
                                            <p>Daftar Bacaan</p>
                                            <p>{bookmarks.length} belum dibaca</p>
                                        </span>
                                        <div className="scrollbar-hide custom-scrollbar grid h-auto max-h-80 gap-4 overflow-y-scroll rounded-lg md:max-h-96">
                                            {bookmarks.length > 0 ? (
                                                bookmarks.map((data, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between gap-5"
                                                    >
                                                        <Link
                                                            href={route('blog.show', {
                                                                post: data.slug,
                                                            })}
                                                            onClick={() => setOpenBookmark(false)}
                                                        >
                                                            <div className="flex cursor-pointer items-center gap-2 md:gap-5">
                                                                <img
                                                                    src={data.image}
                                                                    alt={data.slug}
                                                                    loading="lazy"
                                                                    className="aspect-square w-20 rounded-2xl object-cover md:aspect-video md:w-30"
                                                                />
                                                                <p className="md:text-md p-2 text-sm text-black dark:text-white">
                                                                    {getLimitTextContent(
                                                                        data.title,
                                                                        100,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                        <button
                                                            data-slot="button"
                                                            className="-translate-x-3 md:-translate-x-5"
                                                        >
                                                            <Trash
                                                                className="size-4 cursor-pointer text-red-800 hover:text-red-500 active:text-red-500 md:size-6"
                                                                onClick={() =>
                                                                    removeBoomark(data.slug)
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="w-full text-center">
                                                    <EmptyPost className="text-black dark:text-gray-200">
                                                        Daftar bacaan belum ada
                                                    </EmptyPost>
                                                    <Button
                                                        className="bg-primary w-full rounded-lg py-2 text-sm md:text-lg"
                                                        asChild
                                                    >
                                                        <Link
                                                            href="belajar-islam"
                                                            onClick={() => setOpenBookmark(false)}
                                                        >
                                                            Lihat semua artikel
                                                            <BookOpenText />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {appearance == 'dark' ? (
                        <Sun
                            className="size-5 cursor-pointer transition duration-300 hover:text-green-500 active:text-green-500 lg:size-6"
                            onClick={() => updateAppearance('light')}
                        />
                    ) : (
                        <Moon
                            className="size-5 cursor-pointer transition duration-300 hover:text-green-500 active:text-green-500 lg:size-6"
                            onClick={() => updateAppearance('dark')}
                        />
                    )}
                </div>

                {/* Mobile Dropdown */}
                <div
                    className={`${
                        open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    } bg-primary w-full overflow-hidden transition-all duration-500 ease-in-out lg:hidden`}
                >
                    <div className="mt-3 flex w-full flex-col gap-1 px-4 py-2">
                        {dataNav.map((data, index) => (
                            <div key={index} className="w-full">
                                <Link
                                    href={data.url ?? '#'}
                                    onClick={(e) => {
                                        setActiveDropdown(activeDropdown === index ? null : index);
                                        if (!data.url) return e.preventDefault();
                                        setOpen(false);
                                    }}
                                    className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 font-semibold hover:bg-green-800/50"
                                >
                                    <span className="flex items-center gap-1.5">
                                        {data.name}
                                        {data.isNew && (
                                            <span className="relative flex items-center">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                                                    NEW
                                                </span>
                                            </span>
                                        )}
                                    </span>
                                    {data.submenu.length > 0 && (
                                        <ChevronDown
                                            size={20}
                                            className={`transition-all duration-300 ${
                                                activeDropdown === index ? 'rotate-180' : ''
                                            }`}
                                        />
                                    )}
                                </Link>

                                {/* Submenu Mobile */}
                                <div
                                    className={`flex flex-col overflow-hidden transition-all duration-300 ${
                                        activeDropdown === index
                                            ? 'max-h-screen opacity-100'
                                            : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    {data.submenu.map((sub, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            href={sub.url}
                                            className="block px-5 py-2 hover:text-green-400/100"
                                            onClick={() => setOpen(false)}
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </Container>
    );
};
