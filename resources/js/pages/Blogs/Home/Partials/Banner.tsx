import { Container } from '@/components/Container';
import { asset } from '@/lib/utils';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
const bannerData = [
    { image: asset('assets/banner.jpg') },
    { image: asset('assets/banner2.png') },
    { image: asset('assets/banner3.png') },
    { image: asset('assets/banner4.png') },
];

export const Banner = () => {
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
                            <div className="h-full bg-green-400 text-center align-middle">
                                <img
                                    src={value.image}
                                    alt={value.image}
                                    className="h-full w-full object-fill brightness-90"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
            {/* Banner End */}
        </Container>
    );
};
