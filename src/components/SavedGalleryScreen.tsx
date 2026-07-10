import { useEffect, useState } from 'react';
import { ArrowLeft, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import { getSavedGalleries, deleteGallery, Gallery } from '../utils/storage';

interface SavedGalleryScreenProps {
  onSelect: (gallery: Gallery) => void;
  onEdit: (gallery: Gallery) => void;
  onClose: () => void;
}

export default function SavedGalleryScreen({ onSelect, onEdit, onClose }: SavedGalleryScreenProps) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    setLoading(true);
    const data = await getSavedGalleries();
    setGalleries(data);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteGallery(id);
    loadGalleries();
  };

  const handleEdit = (e: React.MouseEvent, gallery: Gallery) => {
    e.stopPropagation();
    onEdit(gallery);
  };

  return (
    <div className="absolute inset-0 bg-[#fafafa] z-[70] flex flex-col p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-500 font-sans">
      <div className="flex items-center justify-between mb-10 max-w-5xl mx-auto w-full">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors px-4 py-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-3xl font-serif italic tracking-tight text-black">
          Your Galleries
        </h2>
        <div className="w-20" />
      </div>

      <div className="flex-1 overflow-y-auto max-w-5xl mx-auto w-full pb-10">
        {loading ? (
          <div className="flex justify-center items-center h-full text-gray-400 uppercase tracking-widest text-[10px] font-light">
            Loading...
          </div>
        ) : galleries.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-400 uppercase tracking-widest text-[10px] font-light text-center gap-4">
            <div className="p-6 bg-white rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="mt-2 text-gray-500">No galleries created yet.<br/><span className="text-gray-400">Create a new one to begin.</span></p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleries.map((gallery) => (
              <div 
                key={gallery.id} 
                className="group relative cursor-pointer aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100"
                onClick={() => onSelect(gallery)}
              >
                {gallery.photos.length > 0 ? (
                  <img 
                    src={gallery.photos[0]} 
                    alt={gallery.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                  <h3 className="text-white font-serif text-2xl truncate leading-tight">{gallery.name}</h3>
                  <p className="text-white/70 text-[9px] uppercase tracking-widest mt-1">{gallery.photos.length} photos</p>
                </div>

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
                  <button 
                    onClick={(e) => handleEdit(e, gallery)}
                    className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-700 hover:text-black hover:bg-white shadow-sm transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, gallery.id)}
                    className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 shadow-sm transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
