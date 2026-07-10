import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LOADING_TEXTS = [
  "Curating your space..."
];

export default function LoadingOverlay({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none w-full bg-[#fafafa]/50 backdrop-blur-md">
      <div className="text-center w-full px-4">
        <div className="h-8 relative flex items-center justify-center w-full">
          <AnimatePresence mode="popLayout">
            {index < LOADING_TEXTS.length ? (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-black font-sans font-light text-[10px] tracking-[0.3em] uppercase absolute whitespace-nowrap text-center"
              >
                {LOADING_TEXTS[index]}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
