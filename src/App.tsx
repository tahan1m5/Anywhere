import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GalleryGlobe from './components/GalleryGlobe';
import IntroScreen from './components/IntroScreen';
import LocationDetailsScreen from './components/LocationDetailsScreen';
import LoadingOverlay from './components/LoadingOverlay';
import CreateGalleryScreen from './components/CreateGalleryScreen';
import { Gallery } from './utils/storage';

export default function App() {
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [selectedCard, setSelectedCard] = useState<{ image: string } | null>(null);
  const [isLoadingGlobe, setIsLoadingGlobe] = useState(false);
  const [isEditingGallery, setIsEditingGallery] = useState(false);

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
      {currentGallery?.bgImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${currentGallery.bgImage})`,
            opacity: currentGallery.bgOpacity ?? 0.5
          }}
        />
      )}
      
      <div className="absolute inset-0 z-10">
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
                gallery={currentGallery}
                onClose={() => setSelectedCard(null)} 
              />
            )}
          </AnimatePresence>

          {isEditingGallery && (
            <CreateGalleryScreen
              initialGallery={currentGallery}
              onStart={(updatedGallery) => {
                setCurrentGallery(updatedGallery);
                setIsEditingGallery(false);
                setIsLoadingGlobe(true);
              }}
              onClose={() => setIsEditingGallery(false)}
            />
          )}

          {!isLoadingGlobe && !selectedCard && !isEditingGallery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center gap-3 z-30"
            >
              <button 
                onClick={() => setIsEditingGallery(true)}
                className="px-6 py-2.5 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] text-white hover:bg-black tracking-widest uppercase transition-all rounded-full shadow-lg hover:-translate-y-0.5 font-medium"
              >
                EDIT GALLERY
              </button>
              <button 
                onClick={() => setCurrentGallery(null)}
                className="px-6 py-2.5 bg-white backdrop-blur-md border border-black/10 text-[10px] text-black hover:bg-gray-100 tracking-widest uppercase transition-all rounded-full shadow-lg hover:-translate-y-0.5 font-medium"
              >
                BACK TO GALLERIES
              </button>
            </motion.div>
          )}
        </>
      )}
      </div>
    </div>
  );
}

