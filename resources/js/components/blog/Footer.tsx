import { Link } from '@inertiajs/react';
import { Instagram, Send } from 'lucide-react';
import { Container } from '../Container';

export const Footer = () => {
    return (
        <footer className="bg-gray-700 px-3 pt-10 text-green-50 dark:bg-gray-900">
            <Container>
                <div className="grid gap-10 py-5 lg:grid-cols-4 lg:gap-10">
                    <div className="flex flex-col flex-wrap gap-4 lg:col-span-2">
                        <h4 className="text-2xl font-bold text-green-600">Ma'had Ibnu Katsir</h4>
                        <p className="max-w-96 text-sm">
                            Jalan Sawito Pinrang Kanal 3, Sangatta Utara, Kabupaten Kutai
                            Timur,Provinsi Kalimantan Timur, 75683
                        </p>
                        <div className="h-44 w-[300px] overflow-hidden rounded-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53678.28191390308!2d117.56706906143756!3d0.506908226969185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x320a4ae32e9e0abd%3A0xafd3f94aaa6cac94!2sMa&#39;had%20Ibnu%20Katsir!5e0!3m2!1sen!2sid!4v1741762385004!5m2!1sen!2sid"
                                width="auto"
                                height="300"
                                loading="lazy"
                                title="Lokasi Ma'had Ibnu Katsir di Google Maps"
                            ></iframe>
                        </div>
                    </div>
                    <div className="grid gap-6 lg:col-span-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-2xl font-bold text-green-600">Tentang</h4>
                            <div>
                                <ul className="flex flex-col gap-4">
                                    <li className="transition hover:text-green-600 active:text-green-500">
                                        <Link href="belajar-islam?category=info-mahad">
                                            Info Mahad
                                        </Link>
                                    </li>
                                    <li className="transition hover:text-green-600 active:text-green-500">
                                        <Link href="belajar-islam?category=info-taklim">
                                            Info Kajian
                                        </Link>
                                    </li>
                                    <li className="transition hover:text-green-600 active:text-green-500">
                                        <Link href="belajar-islam?category=audio">Audio</Link>
                                    </li>
                                    <li className="transition hover:text-green-600 active:text-green-500">
                                        <Link href="belajar-islam?category=e-book">E-book</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-2xl font-bold text-green-600">Kategori</h4>
                            <div>
                                <ul className="flex flex-col gap-4">
                                    <li className="transition hover:text-green-600 active:text-green-500">
                                        <Link href="belajar-islam?category=artikel">Artikel</Link>
                                    </li>
                                    <li className="transition hover:text-green-600 active:text-green-500">
                                        <Link href="belajar-islam?category=poster">Poster</Link>
                                    </li>
                                    <li className="transition hover:text-green-600 active:text-green-500">
                                        <Link href="belajar-islam?category=tanya-jawab">
                                            Tanya Jawab
                                        </Link>
                                    </li>
                                    <li className="transition hover:text-green-600 active:text-green-500">
                                        <Link href="belajar-islam?sorting=popular">Populer</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-2xl font-bold text-green-600">Sosial Media</h4>
                            <div>
                                <ul className="flex gap-4">
                                    <li>
                                        <a
                                            href="https://www.instagram.com/galeripostersangatta"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram - kajiansangatta.com"
                                        >
                                            <Instagram className="size-5 transition hover:text-green-600 active:text-green-500 md:size-6" />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://t.me/kajianislamsangatta"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Channe Telegram - kajiansangatta.com"
                                        >
                                            <Send className="size-5 transition hover:text-green-600 active:text-green-500 md:size-6" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 border-t-1 py-4 text-center">
                    <p className="text-xs font-medium lg:text-sm">
                        © 2025 Yayasan Ibnu Katsir Kutai Timur, All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
};
