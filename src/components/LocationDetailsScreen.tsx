import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Gallery } from '../utils/storage';

interface LocationDetailsProps {
  data: { image: string };
  gallery: Gallery;
  onClose: () => void;
}

export default function LocationDetailsScreen({ data, gallery, onClose }: LocationDetailsProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = gallery?.photos.findIndex(p => p === data.image);
    return idx >= 0 ? idx : 0;
  });

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!gallery?.photos.length) return;
    setCurrentIndex((prev) => (prev + 1) % gallery.photos.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!gallery?.photos.length) return;
    setCurrentIndex((prev) => (prev - 1 + gallery.photos.length) % gallery.photos.length);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  const currentPhoto = gallery?.photos[currentIndex] || data.image;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 sm:p-12"
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col w-full max-w-4xl h-full max-h-[80vh] relative rounded-3xl z-10 overflow-hidden border border-gray-100"
      >
        <button 
           onClick={onClose} 
           className="absolute top-4 right-4 p-3 bg-white/80 text-black hover:bg-white transition-all z-20 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {gallery?.photos?.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 text-black hover:bg-white transition-all z-20 rounded-full hidden sm:flex items-center justify-center backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 text-black hover:bg-white transition-all z-20 rounded-full hidden sm:flex items-center justify-center backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                {currentIndex + 1} / {gallery.photos.length}
              </div>
            </div>
          </>
        )}

        <div 
          className="w-full h-full bg-[#fafafa] flex-shrink-0 relative overflow-hidden group p-2 select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img 
               key={currentIndex}
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               transition={{ duration: 0.2 }}
               src={currentPhoto} 
               alt="Gallery Preview" 
               className="w-full h-full object-contain rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.03)] bg-white pointer-events-none" 
             />
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
