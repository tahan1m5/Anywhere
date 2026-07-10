import localforage from 'localforage';

export interface Gallery {
  id: string;
  name: string;
  photos: string[];
  createdAt: number;
  bgGradient?: { from: string, to: string };
  bgImage?: string;
  bgOpacity?: number;
}

export async function saveGallery(name: string, photos: string[], bgGradient?: { from: string, to: string }, id?: string, bgImage?: string, bgOpacity?: number): Promise<Gallery> {
  const galleries = await getSavedGalleries();
  const galleryId = id || Date.now().toString();
  const newGallery: Gallery = { id: galleryId, name, photos, createdAt: Date.now(), bgGradient, bgImage, bgOpacity };
  
  if (id) {
    const index = galleries.findIndex(g => g.id === id);
    if (index >= 0) {
      galleries[index] = newGallery;
    } else {
      galleries.unshift(newGallery);
    }
  } else {
    galleries.unshift(newGallery);
  }
  
  await localforage.setItem('saved_galleries', galleries);
  return newGallery;
}

export async function getSavedGalleries(): Promise<Gallery[]> {
  const galleries = await localforage.getItem<Gallery[]>('saved_galleries');
  return galleries || [];
}

export async function deleteGallery(id: string): Promise<void> {
  const galleries = await getSavedGalleries();
  const updatedGalleries = galleries.filter(g => g.id !== id);
  await localforage.setItem('saved_galleries', updatedGalleries);
}
