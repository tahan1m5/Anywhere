import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GalleryGlobe from './components/GalleryGlobe';
import IntroScreen from './components/IntroScreen';
import LocationDetailsScreen from './components/LocationDetailsScreen';
import LoadingOverlay from './components/LoadingOverlay';
import { Gallery } from './utils/storage';

export default function App() {
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [selectedCard, setSelectedCard] = useState<{ image: string } | null>(null);
  const [isLoadingGlobe, setIsLoadingGlobe] = useState(false);

  const handleStart = (gallery: Gallery) => {
    setCurrentGallery(gallery);
    setIsLoadingGlobe(true);
  };

  return (
    <div 
      className="w-full h-full relative overflow-hidden transition-colors duration-1000"
      style={currentGallery?.bgGradient ? {
        background: `linear-gradient(to bottom right, ${currentGallery.bgGradient.from}, ${currentGallery.bgGradient.to})`
      } : { background: '#ffffff' }}
    >
      {!currentGallery ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <IntroScreen onStart={handleStart} />
        </div>
      ) : (
        <>
          <AnimatePresence>
            {isLoadingGlobe && (
              <motion.div
                key="loading-overlay"
                className="absolute inset-0 z-40"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <LoadingOverlay onComplete={() => setIsLoadingGlobe(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ scale: 1, opacity: 0 }}
            animate={
              isLoadingGlobe 
                ? { scale: 1, opacity: 0 } 
                : { scale: selectedCard ? 0.8 : 1, opacity: selectedCard ? 0.3 : 1 }
            }
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 ${selectedCard ? 'pointer-events-none' : ''}`}
          >
            <GalleryGlobe 
              gallery={currentGallery} 
              onSelect={(img) => setSelectedCard({ image: img })} 
            />
          </motion.div>

          <AnimatePresence>
            {selectedCard && (
              <LocationDetailsScreen 
                key="location-details"
                data={selectedCard} 
                onClose={() => setSelectedCard(null)} 
              />
            )}
          </AnimatePresence>

          {!isLoadingGlobe && !selectedCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-8 left-0 right-0 flex justify-center z-30"
            >
              <button 
                onClick={() => setCurrentGallery(null)}
                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] text-white hover:bg-white/20 tracking-widest uppercase transition-all rounded-full mix-blend-difference shadow-sm hover:-translate-y-0.5"
              >
                BACK TO GALLERIES
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

