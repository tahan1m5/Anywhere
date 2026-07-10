import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../data';
import Globe from './Globe';
import { Gallery } from '../utils/storage';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const DEFAULT_CAMERA_Z = isMobile ? 28.8 : 19.8;

function CameraController({ targetZ }: { targetZ: React.MutableRefObject<number> }) {
  useFrame((state) => {
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z, 
      targetZ.current, 
      0.05
    );
  });
  return null;
}

export default function GalleryGlobe({ gallery, onSelect }: { gallery: Gallery, onSelect: (image: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const targetZ = useRef(DEFAULT_CAMERA_Z);
  const rotationState = useRef({ x: 0, y: 0 });
  const velocityState = useRef({ x: 0, y: 0.002 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastInteractionTime = useRef(Date.now() - 3000);
  const pointerPos = useRef({ x: 0, y: 0 });
  
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [tooltipInfo, setTooltipInfo] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const parseTooltip = (info: string) => {
    return info || 'Photo';
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      lastInteractionTime.current = Date.now();
      const delta = e.deltaY;
      targetZ.current += delta * 0.015;
      targetZ.current = Math.max(-GLOBE_RADIUS * 0.8, Math.min(isMobile ? 35 : 28, targetZ.current));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsMouseDown(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
    lastInteractionTime.current = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerPos.current = { x: e.clientX, y: e.clientY };
    if (tooltipRef.current) {
      tooltipRef.current.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 16}px)`;
    }
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    velocityState.current.y += deltaX * 0.005;
    velocityState.current.x += deltaY * 0.005;
    lastInteractionTime.current = Date.now();
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setIsMouseDown(false);
    lastInteractionTime.current = Date.now();
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 0, DEFAULT_CAMERA_Z], fov: 45, near: 0.1 }}>
        <CameraController targetZ={targetZ} />
        <Suspense fallback={null}>
          <Globe 
            gallery={gallery}
            rotationState={rotationState}
            velocityState={velocityState}
            isDragging={isDragging}
            lastInteraction={lastInteractionTime}
            onSelect={onSelect}
            onHover={(info) => setTooltipInfo(parseTooltip(info))}
            onHoverOut={() => setTooltipInfo(null)}
          />
        </Suspense>
      </Canvas>

      {tooltipInfo && (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-sans text-xs tracking-widest uppercase font-light whitespace-nowrap shadow-xl"
          style={{ 
            willChange: 'transform',
            transform: `translate(${pointerPos.current.x + 16}px, ${pointerPos.current.y + 16}px)`
          }}
        >
          {tooltipInfo}
        </div>
      )}
    </div>
  );
}
