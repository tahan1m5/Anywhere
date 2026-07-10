import * as THREE from 'three';
import { useMemo, useRef, useState, useEffect } from 'react';
import { CARD_WIDTH, CARD_HEIGHT, GLOBE_RADIUS } from '../data';

interface CardProps {
  position: THREE.Vector3;
  scale?: number;
  photoUrl: string;
  onSelect: (image: string) => void;
  onHover?: (info: string) => void;
  onHoverOut?: () => void;
}

export default function Card({ position, scale = 1, photoUrl, onSelect, onHover, onHoverOut }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let active = true;
    
    // Default placeholder
    const grayCanvas = document.createElement('canvas');
    grayCanvas.width = 400;
    grayCanvas.height = 500;
    const gCtx = grayCanvas.getContext('2d');
    if (gCtx) {
      gCtx.fillStyle = '#E5E5E5';
      gCtx.fillRect(0, 0, 400, 500);
    }
    const initialTex = new THREE.CanvasTexture(grayCanvas);
    initialTex.minFilter = THREE.LinearMipmapLinearFilter;
    initialTex.generateMipmaps = true;
    setTexture(initialTex);
    
    if (photoUrl) {
      new THREE.TextureLoader().load(photoUrl, (loadedTex) => {
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.generateMipmaps = true;
        if (active) {
          setTexture(loadedTex);
        }
      }, undefined, (err) => {
        console.error("Error loading texture:", err);
      });
    }

    return () => {
      active = false;
    };
  }, [photoUrl]);

  const rotationQuaternion = useMemo(() => {
    const dummy = new THREE.Object3D();
    dummy.position.copy(position);
    dummy.lookAt(position.clone().multiplyScalar(2));
    return dummy.quaternion.clone();
  }, [position]);

  const geometry = useMemo(() => {
    const width = CARD_WIDTH * scale;
    const height = CARD_HEIGHT * scale;
    const geo = new THREE.PlaneGeometry(width, height, 32, 32);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      const theta = x / GLOBE_RADIUS;
      const phi = y / GLOBE_RADIUS;
      
      const newX = GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi);
      const newY = GLOBE_RADIUS * Math.sin(phi);
      const newZ = GLOBE_RADIUS * Math.cos(theta) * Math.cos(phi) - GLOBE_RADIUS;
      
      pos.setXYZ(i, newX, newY, newZ);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [scale]);

  return (
    <mesh 
      position={position} 
      quaternion={rotationQuaternion}
      ref={meshRef} 
      geometry={geometry} 
      onClick={(e) => {
        e.stopPropagation();
        onSelect(photoUrl);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        if (onHover) onHover('');
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
        if (onHoverOut) onHoverOut();
      }}
    >
      {texture && (
        <meshBasicMaterial 
          map={texture} 
          side={THREE.DoubleSide} 
          toneMapped={false} 
        />
      )}
    </mesh>
  );
}
