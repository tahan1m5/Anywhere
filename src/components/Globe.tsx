import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateFibonacciSphere } from '../utils/math';
import { GLOBE_RADIUS } from '../data';
import Card from './Card';
import { Gallery } from '../utils/storage';

interface GlobeProps {
  gallery: Gallery;
  rotationState: React.MutableRefObject<{ x: number, y: number }>;
  velocityState: React.MutableRefObject<{ x: number, y: number }>;
  isDragging: React.MutableRefObject<boolean>;
  lastInteraction: React.MutableRefObject<number>;
  onSelect: (image: string) => void;
  onHover?: (info: string) => void;
  onHoverOut?: () => void;
}

export default function Globe({ gallery, rotationState, velocityState, isDragging, lastInteraction, onSelect, onHover, onHoverOut }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const cardCount = gallery.photos.length;
  const targetCount = Math.max(48, cardCount);

  const cardData = useMemo(() => {
    if (cardCount === 0) return [];
    const rawPositions = generateFibonacciSphere(targetCount, GLOBE_RADIUS);
    return rawPositions.map((pos, i) => ({
      position: pos,
      scale: 0.6 + Math.random() * 0.7,
      photoUrl: gallery.photos[i % cardCount]
    }));
  }, [targetCount, cardCount, gallery.photos]);

  useFrame(() => {
    if (!groupRef.current) return;
    
    rotationState.current.x += velocityState.current.x;
    rotationState.current.y += velocityState.current.y;
    rotationState.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationState.current.x));

    if (!isDragging.current) {
      velocityState.current.x *= 0.92;
      velocityState.current.y *= 0.92;
      if (Date.now() - lastInteraction.current > 2000) {
        velocityState.current.y += 0.00015; 
      }
    } else {
      velocityState.current.x *= 0.3;
      velocityState.current.y *= 0.3;
    }

    groupRef.current.rotation.x = rotationState.current.x;
    groupRef.current.rotation.y = rotationState.current.y;
  });

  return (
    <group ref={groupRef}>
      {cardData.map((data, i) => (
        <Card 
           key={i} 
           position={data.position} 
           scale={data.scale} 
           photoUrl={data.photoUrl} 
           onSelect={(img) => {
            if (!isDragging.current) {
              onSelect(img);
            }
          }}
          onHover={onHover}
          onHoverOut={onHoverOut}
        />
      ))}
    </group>
  );
}
