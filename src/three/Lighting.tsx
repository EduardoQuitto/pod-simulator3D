import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightingProps {
  timeSlotIndex: number;
}

const TIME_CONFIGS = [
  { skyColor: '#ffeedd', sunColor: '#ffcc88', ambIntensity: 0.35, sunIntensity: 1.8, sunPos: [15, 8, 10] as [number, number, number], fogColor: '#1a1510', exposure: 1.0, hemiIntensity: 0.45 },
  { skyColor: '#ffffee', sunColor: '#ffffff', ambIntensity: 0.45, sunIntensity: 2.2, sunPos: [12, 15, 8] as [number, number, number], fogColor: '#1a1815', exposure: 1.15, hemiIntensity: 0.5 },
  { skyColor: '#ffffff', sunColor: '#ffffff', ambIntensity: 0.5, sunIntensity: 2.8, sunPos: [5, 20, 5] as [number, number, number], fogColor: '#1a1a1a', exposure: 1.25, hemiIntensity: 0.55 },
  { skyColor: '#fff8ee', sunColor: '#ffeecc', ambIntensity: 0.45, sunIntensity: 2.2, sunPos: [-5, 18, 8] as [number, number, number], fogColor: '#1a1815', exposure: 1.1, hemiIntensity: 0.5 },
  { skyColor: '#ffeecc', sunColor: '#ffddaa', ambIntensity: 0.4, sunIntensity: 1.8, sunPos: [-12, 12, 10] as [number, number, number], fogColor: '#181510', exposure: 1.0, hemiIntensity: 0.45 },
  { skyColor: '#ffddbb', sunColor: '#ffcc88', ambIntensity: 0.35, sunIntensity: 1.3, sunPos: [-15, 6, 10] as [number, number, number], fogColor: '#150f0a', exposure: 0.85, hemiIntensity: 0.4 },
  { skyColor: '#8899cc', sunColor: '#6677aa', ambIntensity: 0.2, sunIntensity: 0.4, sunPos: [-10, 3, 8] as [number, number, number], fogColor: '#0a0b15', exposure: 0.65, hemiIntensity: 0.25 },
  { skyColor: '#445566', sunColor: '#334455', ambIntensity: 0.12, sunIntensity: 0.08, sunPos: [-8, 1, 5] as [number, number, number], fogColor: '#050508', exposure: 0.45, hemiIntensity: 0.15 },
];

export function Lighting({ timeSlotIndex }: LightingProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);

  const config = TIME_CONFIGS[timeSlotIndex] || TIME_CONFIGS[0];
  const targetAmbColor = new THREE.Color(config.skyColor);
  const targetSunColor = new THREE.Color(config.sunColor);

  useFrame(({ scene }) => {
    const t = 0.02;
    if (ambientRef.current) {
      ambientRef.current.color.lerp(targetAmbColor, t);
      ambientRef.current.intensity += (config.ambIntensity - ambientRef.current.intensity) * t;
    }
    if (sunRef.current) {
      sunRef.current.color.lerp(targetSunColor, t);
      sunRef.current.intensity += (config.sunIntensity - sunRef.current.intensity) * t;
      sunRef.current.position.lerp(new THREE.Vector3(...config.sunPos), t);
    }
    if (hemiRef.current) {
      hemiRef.current.color.lerp(targetAmbColor, t);
      hemiRef.current.intensity += (config.hemiIntensity - hemiRef.current.intensity) * t;
    }
    const currentFog = scene.fog as THREE.Fog;
    if (currentFog) {
      const targetFogColor = new THREE.Color(config.fogColor);
      currentFog.color.lerp(targetFogColor, t);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} color={config.skyColor} intensity={config.ambIntensity} />
      <directionalLight
        ref={sunRef}
        color={config.sunColor}
        intensity={config.sunIntensity}
        position={config.sunPos}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0002}
        shadow-normalBias={0.015}
        shadow-radius={4}
      />
      <hemisphereLight ref={hemiRef} color={config.skyColor} groundColor="#2a2015" intensity={config.hemiIntensity} />

      {/* Corridor lights - warm white, realistic classroom lighting */}
      <pointLight color="#fff0d4" intensity={1.0} position={[-0.5, 3.0, -16]} distance={10} decay={2} />
      <pointLight color="#fff0d4" intensity={1.0} position={[-0.5, 3.0, -8]} distance={10} decay={2} />
      <pointLight color="#fff0d4" intensity={1.0} position={[-0.5, 3.0, 0]} distance={10} decay={2} />
      <pointLight color="#fff0d4" intensity={1.0} position={[-0.5, 3.0, 8]} distance={10} decay={2} />
      <pointLight color="#fff0d4" intensity={1.0} position={[-0.5, 3.0, 16]} distance={10} decay={2} />

      {/* Room lights */}
      <pointLight color="#fff5e6" intensity={0.7} position={[6, 3.0, -13.25]} distance={8} decay={2} />
      <pointLight color="#fff5e6" intensity={0.7} position={[6, 3.0, -6.5]} distance={8} decay={2} />
      <pointLight color="#fff5e6" intensity={0.7} position={[6, 3.0, 2.5]} distance={8} decay={2} />
      <pointLight color="#fff5e6" intensity={0.7} position={[6, 3.0, 11.5]} distance={8} decay={2} />
      <pointLight color="#e0d8c8" intensity={0.5} position={[-5, 3.0, -3]} distance={7} decay={2} />
      <pointLight color="#d8d0c0" intensity={0.5} position={[-11, 3.0, 9.5]} distance={9} decay={2} />
      <pointLight color="#e0e8f0" intensity={0.35} position={[6.5, 3.0, 26]} distance={9} decay={2} />

      {/* Subtle rim lights for depth */}
      <pointLight color="#aabbdd" intensity={0.15} position={[-14, 1.5, 0]} distance={12} decay={2} />
      <pointLight color="#ddaa88" intensity={0.15} position={[14, 1.5, 0]} distance={12} decay={2} />
    </>
  );
}
