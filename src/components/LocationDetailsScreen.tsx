import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface LocationDetailsProps {
  data: { image: string };
  onClose: () => void;
}

export default function LocationDetailsScreen({ data, onClose }: LocationDetailsProps) {
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
        <div className="w-full h-full bg-[#fafafa] flex-shrink-0 relative overflow-hidden group p-2">
          <img 
             src={data.image} 
             alt="Gallery Preview" 
             className="w-full h-full object-contain rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.03)] bg-white" 
           />
        </div>
      </motion.div>
    </motion.div>
  );
}
