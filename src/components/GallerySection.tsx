import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Camera } from 'lucide-react';

interface PolaroidPhoto {
  id: number;
  url: string;
  caption: string;
  rotation: string; // Tailwind class for rotation (e.g. rotate-3)
  delay: number;
}

export const GallerySection: React.FC = () => {
  const photos: PolaroidPhoto[] = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=600&auto=format&fit=crop',
      caption: 'Secangkir hangat di pagi hari',
      rotation: 'hover:rotate-0 -rotate-3',
      delay: 0.1,
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      caption: 'Menatap senja di ujung pantai',
      rotation: 'hover:rotate-0 rotate-2',
      delay: 0.2,
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
      caption: 'Mekar indah seperti senyummu',
      rotation: 'hover:rotate-0 -rotate-2',
      delay: 0.3,
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
      caption: 'Cerita lama yang abadi',
      rotation: 'hover:rotate-0 rotate-3',
      delay: 0.1,
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
      caption: 'Momen kecil penuh tawa',
      rotation: 'hover:rotate-0 -rotate-1',
      delay: 0.2,
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
      caption: 'Mengabadikan setiap detik',
      rotation: 'hover:rotate-0 rotate-1',
      delay: 0.3,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 15,
        delay: customDelay,
      },
    }),
  };

  return (
    <section className="relative min-h-screen px-6 py-24 bg-[#12100e] overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-theme-blueMedium/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-theme-brownDark/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-theme-brownMedium font-semibold flex items-center gap-1.5 mb-3">
            <Camera size={14} className="text-theme-blueMedium" />
            Galeri Memori
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-theme-brownLight font-light tracking-wide">
            Setiap Detik Bersamamu
          </h2>
          <p className="font-sans text-xs md:text-sm text-theme-blueLight/60 tracking-wider max-w-md mt-4">
            Kumpulan potret kecil yang melukiskan kenangan manis dan hangat di antara kita.
          </p>
        </motion.div>

        {/* Polaroid Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 w-full px-4"
        >
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              variants={itemVariants}
              custom={photo.delay}
              className={`polaroid-card flex flex-col bg-[#fdfdfb] p-4 pb-6 border border-gray-200/50 rounded-sm transform ${photo.rotation} select-none`}
            >
              {/* Photo Area */}
              <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-sm">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  loading="lazy"
                />
                {/* Vintage overlay texture */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              </div>

              {/* Caption Area */}
              <div className="mt-5 text-center flex flex-col items-center justify-center">
                <p className="font-serif text-gray-800 text-base italic leading-tight">
                  {photo.caption}
                </p>
                {/* Small heart/stamp stamp */}
                <span className="text-[10px] text-gray-400 font-sans tracking-widest uppercase mt-2 font-semibold">
                  Memory #{photo.id}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
