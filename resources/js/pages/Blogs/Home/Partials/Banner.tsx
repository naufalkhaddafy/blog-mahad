import { Container } from '@/components/Container';
import { BannerProps } from '@/pages/Banner/Index';
import { Link } from '@inertiajs/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const Banner = ({ bannerData }: { bannerData: BannerProps[] }) => {
    return (
        <Container>
            {/* Banner */}
            <section>
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                        clickable: true,
                    }}
                    spaceBetween={50}
                    loop={true}
                    effect={'fade'}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Navigation, Pagination, EffectFade, Autoplay]}
                    className="aspect-video w-full rounded-xl shadow-xl lg:aspect-16/6"
                >
                    {bannerData.map((value, index) => (
                        <SwiperSlide key={index}>
                            <Link href={value.url || ''}>
                                <div className="h-full bg-green-600 text-center align-middle">
                                    <img
                                        src={value.image}
                                        alt={value.title}
                                        className="h-full w-full object-fill brightness-90 dark:brightness-80"
                                        loading="lazy"
                                    />
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
            {/* Banner End */}
        </Container>
    );
};
