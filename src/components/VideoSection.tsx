import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import local video assets
import vid1 from '../assets/vidio/1.mp4';
import vid2 from '../assets/vidio/2.mp4';
import vid3 from '../assets/vidio/3.mp4';

interface VideoData {
  id: number;
  url: string;
  title: string;
  caption: string;
}

interface VideoSectionProps {
  onNext: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ onNext }) => {
  const { duckMusic } = useAudio();
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const videos: VideoData[] = [
    {
      id: 1,
      url: vid1,
      title: 'awal banget ini mah',
      caption: 'waktu ak masih usil, dan kamu caper wkwkw.',
    },
    {
      id: 2,
      url: vid2,
      title: 'menengah',
      caption: 'udah sering banget bareng.',
    },
    {
      id: 3,
      url: vid3,
      title: 'gatau ini',
      caption: 'liat aja lah vidionya',
    },
  ];

  const handleVideoPlay = (id: number) => {
    // 1. Duck global background music
    duckMusic(true);

    // 2. Pause other playing videos (if any)
    Object.keys(videoRefs.current).forEach((key) => {
      const idx = Number(key);
      if (idx !== id && videoRefs.current[idx]) {
        videoRefs.current[idx]?.pause();
      }
    });
  };

  const handleVideoPauseOrEnd = () => {
    // Restore global background music volume
    duckMusic(false);
  };

  const handleSlideChange = () => {
    // Pause all videos when sliding to ensure no overlapping sound and restore music
    Object.values(videoRefs.current).forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });
    duckMusic(false);
  };

  return (
    <section className="relative min-h-screen px-4 py-24 bg-transparent flex flex-col justify-center items-center overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-theme-brownDark/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-theme-blueMedium/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
       
          <h2 className="font-serif text-3xl md:text-5xl text-theme-brownLight font-light tracking-wide">
            A Moment For You
          </h2>
          <p className="font-sans text-xs md:text-sm text-theme-blueLight/60 tracking-wider max-w-md mt-4">
           Mungkin sedikit moment dari awal banget
          </p>
        </motion.div>

        {/* Swiper Slider Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full relative px-2 md:px-0"
        >
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            breakpoints={{
              640: {
                slidesPerView: 1.3,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 1.6,
                spaceBetween: 50,
              },
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            onSlideChange={handleSlideChange}
            className="w-full pb-10"
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id} className="transition-all duration-500 rounded-3xl overflow-hidden shadow-2xl bg-[#1e1a18]/20 border border-theme-brownDark/10">
                {({ isActive }) => (
                  <div className={`relative aspect-video w-full transition-transform duration-500 overflow-hidden ${isActive ? 'scale-100' : 'scale-95 opacity-60'}`}>
                    <video
                      ref={(el) => { videoRefs.current[video.id] = el; }}
                      src={video.url}
                      controls
                      playsInline
                      className="w-full h-full object-cover rounded-2xl bg-black"
                      onPlay={() => handleVideoPlay(video.id)}
                      onPause={handleVideoPauseOrEnd}
                      onEnded={handleVideoPauseOrEnd}
                    />
                    
                    {/* Visual overlay for inactive slide to enhance focus on active */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-[#0c1017]/40 pointer-events-none backdrop-blur-[1px]"></div>
                    )}

                    {/* Small tag/title on the active slide */}
                    {isActive && (
                      <div className="absolute bottom-4 left-4 right-4 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-xl text-left">
                        <h3 className="font-serif text-white text-base md:text-lg font-medium">{video.title}</h3>
                        <p className="font-sans text-[11px] md:text-xs text-gray-300 font-light mt-1">{video.caption}</p>
                      </div>
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Minimalist dot pagination element */}
          <div className="swiper-pagination flex justify-center items-center gap-1.5"></div>
        </motion.div>

        {/* Lanjutkan button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <button
            onClick={onNext}
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-theme-brownMedium/20 to-theme-blueMedium/20 border border-theme-brownMedium/30 hover:border-theme-blueMedium/60 transition-all duration-300 text-theme-brownLight hover:text-white cursor-pointer shadow-md text-xs tracking-wider uppercase font-semibold"
          >
            Lanjutkan
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
