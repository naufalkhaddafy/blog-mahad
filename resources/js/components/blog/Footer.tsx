import { Container } from '../Container';

export const Footer = () => {
    return (
        <footer className="bg-gray-700 pt-10 text-green-50">
            <Container className="px-5 xl:px-0">
                <div className="grid gap-10 py-5 lg:grid-cols-4 lg:gap-10">
                    <div className="flex flex-col flex-wrap gap-4 lg:col-span-2">
                        <h3 className="text-2xl font-bold text-green-600">Ma'had Ibnu Katsir</h3>
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
                            ></iframe>
                        </div>
                    </div>
                    <div className="grid gap-6 lg:col-span-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-green-600">Tentang</h3>
                            <div>
                                <ul className="flex flex-col gap-4">
                                    <li>Artikel</li>
                                    <li>Poster</li>
                                    <li>E-Book</li>
                                    <li>Tanya Jawab</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-green-600">Kategori</h3>
                            <div>
                                <ul className="flex flex-col gap-4">
                                    <li>Artikel</li>
                                    <li>Poster</li>
                                    <li>E-Book</li>
                                    <li>Tanya Jawab</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-green-600">Sosial Media</h3>
                            <div>
                                <ul className="flex flex-col gap-4">
                                    <li>Artikel</li>
                                    <li>Poster</li>
                                    <li>E-Book</li>
                                    <li>Tanya Jawab</li>
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
