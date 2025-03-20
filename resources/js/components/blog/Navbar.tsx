import { useAppearance } from '@/hooks/use-appearance';
import { asset } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Bookmark, ChevronDown, Menu, Moon, Search, Sun } from 'lucide-react';
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

    return (
        <Container className="px-3 py-4 xl:py-3">
            <nav className="flex flex-wrap items-center justify-between bg-green-700">
                <div className="flex items-center gap-3">
                    <button className="cursor-pointer lg:hidden" onClick={() => setOpen(!open)}>
                        <Menu className="size-5 cursor-pointer transition duration-300 hover:text-green-500" />
                    </button>
                    <Link href="/">
                        <div className="flex items-center gap-2 lg:gap-4">
                            <img
                                src={asset('assets/icon.png')}
                                alt="Icon"
                                className="size-8 lg:size-14"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-sm font-semibold xl:text-xl">
                                    Kajian Islam Sangatta
                                </h1>
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
                    <Search className="size-5 cursor-pointer transition duration-300 hover:text-green-500 lg:size-6" />
                    <Bookmark className="size-5 cursor-pointer transition duration-300 hover:text-green-500 lg:size-6" />
                    {appearance == 'dark' ? (
                        <Sun
                            className="size-5 cursor-pointer transition duration-300 hover:text-green-500 lg:size-6"
                            onClick={() => updateAppearance('light')}
                        />
                    ) : (
                        <Moon
                            className="size-5 cursor-pointer transition duration-300 hover:text-green-500 lg:size-6"
                            onClick={() => updateAppearance('dark')}
                        />
                    )}
                </div>

                {/* Mobile Dropdown */}
                <div
                    className={`${
                        open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    } w-full overflow-hidden bg-green-700 transition-all duration-500 ease-in-out lg:hidden`}
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
