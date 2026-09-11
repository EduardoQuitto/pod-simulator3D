import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightingProps {
  timeSlotIndex: number;
}

const TIME_COLORS = [
  { ambient: '#ffeedd', sun: '#ffcc88', ambIntensity: 0.5, sunIntensity: 1.0, fogColor: '#1a1a2a', hemiSky: '#ffeedd', hemiGround: '#3a3a3a' },
  { ambient: '#ffffee', sun: '#ffffff', ambIntensity: 0.6, sunIntensity: 1.3, fogColor: '#1a1a2a', hemiSky: '#ffffee', hemiGround: '#3a3a3a' },
  { ambient: '#ffffff', sun: '#ffffff', ambIntensity: 0.7, sunIntensity: 1.4, fogColor: '#1a1a2a', hemiSky: '#ffffff', hemiGround: '#4a4a4a' },
  { ambient: '#fff8ee', sun: '#ffeecc', ambIntensity: 0.65, sunIntensity: 1.2, fogColor: '#1a1a2a', hemiSky: '#fff8ee', hemiGround: '#3a3a3a' },
  { ambient: '#ffeecc', sun: '#ffddaa', ambIntensity: 0.6, sunIntensity: 1.0, fogColor: '#1a1a2a', hemiSky: '#ffeecc', hemiGround: '#3a3a3a' },
  { ambient: '#ffddbb', sun: '#ffcc88', ambIntensity: 0.55, sunIntensity: 0.8, fogColor: '#1a1a2a', hemiSky: '#ffddbb', hemiGround: '#3a3a3a' },
  { ambient: '#ccddff', sun: '#8899cc', ambIntensity: 0.35, sunIntensity: 0.4, fogColor: '#111122', hemiSky: '#8899cc', hemiGround: '#222233' },
  { ambient: '#8899bb', sun: '#556688', ambIntensity: 0.2, sunIntensity: 0.15, fogColor: '#0a0a15', hemiSky: '#556688', hemiGround: '#111122' },
];

export function Lighting({ timeSlotIndex }: LightingProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);

  const current = TIME_COLORS[timeSlotIndex] || TIME_COLORS[0];
  const targetAmb = new THREE.Color(current.ambient);
  const targetSun = new THREE.Color(current.sun);
  const targetHemi = new THREE.Color(current.hemiSky);

  useFrame(() => {
    if (ambientRef.current) {
      ambientRef.current.color.lerp(targetAmb, 0.015);
      ambientRef.current.intensity += (current.ambIntensity - ambientRef.current.intensity) * 0.015;
    }
    if (sunRef.current) {
      sunRef.current.color.lerp(targetSun, 0.015);
      sunRef.current.intensity += (current.sunIntensity - sunRef.current.intensity) * 0.015;
      const angle = (timeSlotIndex / 7) * Math.PI * 0.8 + 0.2;
      sunRef.current.position.x = Math.cos(angle) * 18;
      sunRef.current.position.y = Math.sin(angle) * 12 + 5;
      sunRef.current.position.z = 8;
    }
    if (hemiRef.current) {
      hemiRef.current.color.lerp(targetHemi, 0.015);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} color={current.ambient} intensity={current.ambIntensity} />
      <directionalLight
        ref={sunRef}
        color={current.sun}
        intensity={current.sunIntensity}
        position={[12, 15, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <hemisphereLight ref={hemiRef} color={current.hemiSky} groundColor={current.hemiGround} intensity={0.35} />
      <pointLight color="#fff5e6" intensity={0.2} position={[0, 2.8, -10]} distance={8} />
      <pointLight color="#fff5e6" intensity={0.2} position={[0, 2.8, 0]} distance={8} />
      <pointLight color="#fff5e6" intensity={0.2} position={[0, 2.8, 10]} distance={8} />
    </>
  );
}
