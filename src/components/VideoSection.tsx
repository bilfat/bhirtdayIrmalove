import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { Video, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

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
      url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-burning-sparkler-close-up-4007-large.mp4',
      title: 'Harapan Kecil',
      caption: 'Menyalakan asa di hari yang penuh kegembiraan ini.',
    },
    {
      id: 2,
      url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
      title: 'Tenang & Teduh',
      caption: 'Seperti air mengalir, begitulah damai membimbing langkahmu.',
    },
    {
      id: 3,
      url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-4613-large.mp4',
      title: 'Luas & Indah',
      caption: 'Harapan dan cita-citamu seluas samudera yang membentang.',
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
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-theme-blueLight font-semibold flex items-center gap-1.5 mb-3">
            <Video size={14} className="text-theme-brownMedium" />
            Momen Untukmu
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-theme-brownLight font-light tracking-wide">
            Sebuah Pesan Singkat
          </h2>
          <p className="font-sans text-xs md:text-sm text-theme-blueLight/60 tracking-wider max-w-md mt-4">
            Klik tombol putar pada video di bawah ini untuk melihat pesan sinematik kecil. Musik latar akan meredup otomatis.
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
