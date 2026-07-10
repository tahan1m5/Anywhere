import { Grid2x2, Plus } from 'lucide-react';
import { useState } from 'react';
import SavedGalleryScreen from './SavedGalleryScreen';
import CreateGalleryScreen from './CreateGalleryScreen';
import { Gallery } from '../utils/storage';

interface IntroScreenProps {
  onStart: (gallery: Gallery) => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | undefined>(undefined);

  if (showGallery) {
    return (
      <SavedGalleryScreen 
        onSelect={onStart} 
        onEdit={(gallery) => {
          setEditingGallery(gallery);
          setShowGallery(false);
          setShowCreate(true);
        }}
        onClose={() => setShowGallery(false)} 
      />
    );
  }

  if (showCreate) {
    return (
      <CreateGalleryScreen
        initialGallery={editingGallery}
        onStart={onStart}
        onClose={() => {
          setShowCreate(false);
          setEditingGallery(undefined);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto p-8 font-sans text-center">
      <div className="mb-10 text-gray-800">
        <span className="text-4xl">𐔌՞. .՞𐦯</span>
      </div>
      <h1 className="text-6xl font-serif italic tracking-tight mb-4 text-black leading-none">anywhere</h1>
      <p className="text-sm text-gray-500 mb-12 font-light tracking-widest uppercase">
        visualize your world
      </p>

      <div className="flex flex-col gap-4 w-full">
        <button 
          onClick={() => {
            setEditingGallery(undefined);
            setShowCreate(true);
          }}
          className="group flex items-center justify-center gap-3 w-full py-4 px-8 bg-black text-white hover:bg-gray-800 transition-all uppercase tracking-widest text-xs font-medium rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          Create New Sphere
        </button>

        <button 
          onClick={() => setShowGallery(true)}
          className="group flex items-center justify-center gap-3 w-full py-4 px-8 border border-gray-200 text-black bg-white hover:border-black transition-all uppercase tracking-widest text-xs font-medium rounded-full hover:-translate-y-0.5 shadow-sm hover:shadow-md"
        >
          <Grid2x2 className="w-4 h-4 transition-transform group-hover:scale-110" />
          View gallery
        </button>
      </div>
      
      <p className="mt-12 text-[10px] text-gray-400 text-center w-full uppercase tracking-widest font-light">
        All data are stored on users local storage
      </p>
    </div>
  );
}
