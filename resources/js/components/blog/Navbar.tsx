import { useAppearance } from '@/hooks/use-appearance';
import { useBookmark } from '@/hooks/useBookmark';
import { asset, getLimitTextContent } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Bookmark, ChevronDown, Menu, Moon, Search, Sun, Trash } from 'lucide-react';
import { useState } from 'react';
import { Container } from '../Container';

const dataNav = [
    {
        name: 'Beranda',
        url: '/',
        submenu: [],
    },
    {
        name: 'Info Mahad',
        url: '',
        submenu: [
            { name: 'Profil', url: '' },
            { name: 'Berita Mahad', url: '' },
            { name: 'Kontak', url: '' },
        ],
    },
    {
        name: 'Info Kajian',
        url: '',
        submenu: [
            { name: 'Info Taklim', url: route('blog.list', { category: 3 }) },
            { name: 'Info Dauroh', url: route('blog.list', { category: 4 }) },
        ],
    },
    {
        name: 'Belajar Islam',
        url: '/belajar-islam',
        submenu: [],
    },
    {
        name: 'Radio Online',
        url: '',
        submenu: [],
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
                                src={asset('assets/icon.png')}
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
                    <ul className="flex w-full items-center gap-4">
                        {dataNav.map((data, index) => (
                            <div
                                key={index}
                                className="group text-md relative flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 font-semibold transition-normal duration-500 ease-in-out hover:bg-green-800/50"
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
                                >
                                    {data.name}
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
                            </div>
                        ))}
                    </ul>
                </div>

                {/* Mobile Navigation */}
                <div className="flex items-center gap-2 lg:gap-4">
                    <Link href="/belajar-islam">
                        <Search className="size-5 cursor-pointer transition duration-300 hover:text-green-500 active:text-green-500 lg:size-6" />
                    </Link>
                    <div className="relative">
                        <Bookmark
                            className={`size-5 cursor-pointer transition duration-300 hover:text-green-500 active:text-green-500 lg:size-6`}
                            onClick={() => setOpenBookmark(!openBookmark)}
                        />
                        {bookmarks.length > 0 && (
                            <span className="absolute -top-1.5 -right-1 rounded-full bg-gray-200/100 px-1 text-xs text-green-800">
                                {bookmarks.length}
                            </span>
                        )}
                        {openBookmark && (
                            <div className="fixed top-18 right-1/2 h-auto max-h-1/2 w-[97vw] translate-x-1/2 overflow-y-scroll rounded-2xl border-1 bg-gray-100 opacity-100 shadow-xl transition-all transition-discrete duration-500 md:absolute md:top-15 md:-right-1 md:max-h-96 md:w-[600px] md:translate-x-0 dark:bg-gray-900 starting:opacity-0">
                                <div className="relative grid h-full w-full gap-1 p-5 md:gap-4">
                                    <span className="text-primary sticky top-5 flex h-full w-full items-center justify-between rounded-lg p-2 text-sm font-bold backdrop-blur-lg md:p-3 dark:text-green-500">
                                        <p>Daftar Bacaan</p>
                                        <p>{bookmarks.length} belum dibaca</p>
                                    </span>
                                    {bookmarks.map((data, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between gap-5"
                                        >
                                            <div className="flex cursor-pointer items-center gap-2 md:gap-5">
                                                <img
                                                    src={data.image}
                                                    alt={data.slug}
                                                    loading="lazy"
                                                    className="aspect-square w-20 rounded-2xl md:aspect-video md:w-30"
                                                />
                                                <p className="md:text-md p-2 text-sm text-black dark:text-white">
                                                    {getLimitTextContent(data.title, 100)}
                                                </p>
                                            </div>
                                            <button>
                                                <Trash
                                                    className="text-primary size-4 cursor-pointer hover:text-green-500 active:text-green-500 md:size-6"
                                                    onClick={() => removeBoomark(data.slug)}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                    }}
                                    className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 font-semibold hover:bg-green-800/50"
                                >
                                    {data.name}
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
