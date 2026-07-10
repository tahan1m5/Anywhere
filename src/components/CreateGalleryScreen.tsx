import { useState, useRef } from 'react';
import { Upload, ArrowLeft, Trash2, Plus, Star, Image as ImageIcon } from 'lucide-react';
import { Gallery, saveGallery } from '../utils/storage';

interface CreateGalleryScreenProps {
  onStart: (gallery: Gallery) => void;
  onClose: () => void;
  initialGallery?: Gallery;
}

const GRADIENTS = [
  { name: 'Pure White', from: '#ffffff', to: '#f9fafb' },
  { name: 'Soft Silver', from: '#f3f4f6', to: '#e5e7eb' },
  { name: 'Elegant Ash', from: '#d1d5db', to: '#9ca3af' },
  { name: 'Charcoal', from: '#4b5563', to: '#1f2937' },
  { name: 'Midnight', from: '#111827', to: '#030712' },
  { name: 'Noir', from: '#000000', to: '#000000' }
];

export default function CreateGalleryScreen({ onStart, onClose, initialGallery }: CreateGalleryScreenProps) {
  const [name, setName] = useState(initialGallery?.name || '');
  const [photos, setPhotos] = useState<string[]>(initialGallery?.photos || []);
  const [bgGradient, setBgGradient] = useState(initialGallery?.bgGradient || GRADIENTS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              setPhotos((prev) => [...prev, dataUrl]);
            }
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    setPhotos(prev => {
      const newPhotos = [...prev];
      const temp = newPhotos[0];
      newPhotos[0] = newPhotos[index];
      newPhotos[index] = temp;
      return newPhotos;
    });
  };

  const handleSaveAndStart = async (save: boolean) => {
    if (photos.length === 0) {
      alert("Please add at least one photo to populate the globe.");
      return;
    }
    
    let galleryName = name.trim();
    if (!galleryName) {
      galleryName = `Gallery ${new Date().toLocaleDateString()}`;
    }

    let finalGallery: Gallery;
    if (save) {
      finalGallery = await saveGallery(galleryName, photos, bgGradient, initialGallery?.id);
    } else {
      finalGallery = {
        id: initialGallery?.id || 'temp-' + Date.now(),
        name: galleryName,
        photos,
        createdAt: Date.now(),
        bgGradient
      };
    }
    
    onStart(finalGallery);
  };

  return (
    <div className="absolute inset-0 bg-[#fafafa] z-[70] flex flex-col p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-500 font-sans">
      <div className="flex items-center justify-between mb-10 max-w-4xl mx-auto w-full">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors px-4 py-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-3xl font-serif italic tracking-tight text-black">
          {initialGallery ? 'Edit Gallery' : 'New Gallery'}
        </h2>
        <div className="w-20" />
      </div>

      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full flex flex-col gap-10 pb-8 px-2">
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <label className="block text-[10px] font-medium text-gray-400 mb-3 uppercase tracking-widest">Gallery Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g. Summer Memories"
            className="w-full bg-transparent text-2xl font-serif text-black focus:outline-none placeholder:text-gray-300 border-b border-gray-100 focus:border-black transition-colors pb-2"
          />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <label className="block text-[10px] font-medium text-gray-400 mb-6 uppercase tracking-widest">Background Vibe</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {GRADIENTS.map((grad, i) => (
              <button
                key={i}
                onClick={() => setBgGradient(grad)}
                className={`h-14 w-full rounded-2xl border-2 transition-all duration-300 ${bgGradient.name === grad.name ? 'border-black scale-105 shadow-md' : 'border-gray-50 hover:scale-105'}`}
                style={{ background: `linear-gradient(to bottom right, ${grad.from}, ${grad.to})` }}
                title={grad.name}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
            <div>
              <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">Photos ({photos.length})</label>
              <p className="text-[11px] text-gray-400 font-light">Fewer than 48 photos will be elegantly duplicated.</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-[10px] text-black bg-gray-50 hover:bg-gray-100 transition-colors uppercase tracking-widest px-4 py-2.5 rounded-full"
            >
              <Plus className="w-4 h-4" /> Add Photos
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>
          
          {photos.length === 0 ? (
            <div 
              className="w-full h-56 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-4 bg-white rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-gray-300" />
              </div>
              <p className="uppercase tracking-widest text-[10px] mb-1 text-gray-500">Tap to select photos</p>
              <p className="text-[10px] text-gray-400 font-light">48+ recommended for a full experience</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group shadow-sm border border-gray-100">
                  <img src={photo} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  
                  {i === 0 && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[9px] uppercase tracking-widest font-medium rounded-full shadow-sm">
                      Cover
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3">
                    <div className="flex justify-end w-full">
                      <button 
                        onClick={() => removePhoto(i)}
                        className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-md"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {i !== 0 && (
                      <button 
                        onClick={() => setAsCover(i)}
                        className="w-full py-2 bg-white/90 text-black text-[10px] uppercase tracking-widest font-medium rounded-full hover:bg-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Star className="w-3 h-3" /> Set Cover
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div 
                className="aspect-square border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-3 bg-white rounded-full shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-gray-400">Add More</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 max-w-4xl mx-auto w-full flex gap-4 flex-col sm:flex-row">
        <button 
          onClick={() => handleSaveAndStart(true)}
          className="flex-1 bg-black text-white py-4 px-6 rounded-full font-sans uppercase tracking-widest text-[10px] font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Save & Experience
        </button>
        <button 
          onClick={() => handleSaveAndStart(false)}
          className="flex-1 border border-gray-200 bg-white text-black py-4 px-6 rounded-full font-sans uppercase tracking-widest text-[10px] font-medium hover:border-black transition-all hover:-translate-y-0.5"
        >
          Preview Only
        </button>
      </div>
    </div>
  );
}
