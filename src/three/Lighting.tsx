import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightingProps {
  timeSlotIndex: number;
}

const TIME_CONFIGS = [
  { skyColor: '#ffeedd', sunColor: '#ffcc88', ambIntensity: 0.4, sunIntensity: 2.0, sunPos: [15, 8, 10] as [number, number, number], fogColor: '#2a2018', exposure: 1.0 },
  { skyColor: '#ffffee', sunColor: '#ffffff', ambIntensity: 0.5, sunIntensity: 2.5, sunPos: [12, 15, 8] as [number, number, number], fogColor: '#2a2820', exposure: 1.1 },
  { skyColor: '#ffffff', sunColor: '#ffffff', ambIntensity: 0.55, sunIntensity: 3.0, sunPos: [5, 20, 5] as [number, number, number], fogColor: '#2a2a2a', exposure: 1.2 },
  { skyColor: '#fff8ee', sunColor: '#ffeecc', ambIntensity: 0.5, sunIntensity: 2.5, sunPos: [-5, 18, 8] as [number, number, number], fogColor: '#2a2820', exposure: 1.1 },
  { skyColor: '#ffeecc', sunColor: '#ffddaa', ambIntensity: 0.45, sunIntensity: 2.0, sunPos: [-12, 12, 10] as [number, number, number], fogColor: '#2a2518', exposure: 1.0 },
  { skyColor: '#ffddbb', sunColor: '#ffcc88', ambIntensity: 0.4, sunIntensity: 1.5, sunPos: [-15, 6, 10] as [number, number, number], fogColor: '#201a15', exposure: 0.9 },
  { skyColor: '#8899cc', sunColor: '#6677aa', ambIntensity: 0.25, sunIntensity: 0.5, sunPos: [-10, 3, 8] as [number, number, number], fogColor: '#0f1020', exposure: 0.7 },
  { skyColor: '#445566', sunColor: '#334455', ambIntensity: 0.15, sunIntensity: 0.1, sunPos: [-8, 1, 5] as [number, number, number], fogColor: '#080810', exposure: 0.5 },
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
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
        shadow-radius={3}
      />
      <hemisphereLight ref={hemiRef} color={config.skyColor} groundColor="#3a3020" intensity={0.5} />

      {/* Corridor lights */}
      <pointLight color="#fff0d4" intensity={1.2} position={[-0.5, 3.0, -16]} distance={8} decay={2} />
      <pointLight color="#fff0d4" intensity={1.2} position={[-0.5, 3.0, -8]} distance={8} decay={2} />
      <pointLight color="#fff0d4" intensity={1.2} position={[-0.5, 3.0, 0]} distance={8} decay={2} />
      <pointLight color="#fff0d4" intensity={1.2} position={[-0.5, 3.0, 8]} distance={8} decay={2} />
      <pointLight color="#fff0d4" intensity={1.2} position={[-0.5, 3.0, 16]} distance={8} decay={2} />

      {/* Room lights */}
      <pointLight color="#fff5e6" intensity={0.8} position={[6, 3.0, -13.25]} distance={7} decay={2} />
      <pointLight color="#fff5e6" intensity={0.8} position={[6, 3.0, -6.5]} distance={7} decay={2} />
      <pointLight color="#fff5e6" intensity={0.8} position={[6, 3.0, 2.5]} distance={7} decay={2} />
      <pointLight color="#fff5e6" intensity={0.8} position={[6, 3.0, 11.5]} distance={7} decay={2} />
      <pointLight color="#e0d8c8" intensity={0.6} position={[-5, 3.0, -3]} distance={6} decay={2} />
      <pointLight color="#d8d0c0" intensity={0.6} position={[-11, 3.0, 9.5]} distance={8} decay={2} />
      <pointLight color="#e0e8f0" intensity={0.4} position={[6.5, 3.0, 26]} distance={8} decay={2} />
    </>
  );
}
