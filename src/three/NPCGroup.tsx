import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NPCS } from '../data/school';

function NPCModel({ npc }: { npc: typeof NPCS[number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const bobOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 1.5 + bobOffset.current) * 0.015;
    groupRef.current.rotation.y = Math.sin(t * 0.3 + bobOffset.current) * 0.08;
  });

  return (
    <group ref={groupRef} position={npc.position}>
      {/* Legs */}
      <mesh position={[-0.1, 0.25, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 3, 6]} />
        <meshStandardMaterial color={new THREE.Color(npc.bodyColor).multiplyScalar(0.7)} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.25, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 3, 6]} />
        <meshStandardMaterial color={new THREE.Color(npc.bodyColor).multiplyScalar(0.7)} roughness={0.8} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 4, 8]} />
        <meshStandardMaterial color={npc.bodyColor} roughness={0.7} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.3, 0.65, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.35, 3, 6]} />
        <meshStandardMaterial color={npc.bodyColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.3, 0.65, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.35, 3, 6]} />
        <meshStandardMaterial color={npc.bodyColor} roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color={npc.color} roughness={0.6} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.42, -0.02]} castShadow>
        <sphereGeometry args={[0.17, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={new THREE.Color(npc.bodyColor).multiplyScalar(0.5)} roughness={0.9} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.06, 1.32, 0.15]}>
        <sphereGeometry args={[0.025, 4, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.06, 1.32, 0.15]}>
        <sphereGeometry args={[0.025, 4, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Eye whites */}
      <mesh position={[-0.06, 1.32, 0.14]}>
        <sphereGeometry args={[0.03, 4, 4]} />
        <meshStandardMaterial color="#f8f8f0" />
      </mesh>
      <mesh position={[0.06, 1.32, 0.14]}>
        <sphereGeometry args={[0.03, 4, 4]} />
        <meshStandardMaterial color="#f8f8f0" />
      </mesh>
      {/* Interaction indicator */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color={npc.bodyColor} emissive={npc.bodyColor} emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export const NPCGroup = memo(function NPCGroup() {
  return (
    <>
      {NPCS.map((npc) => (
        <NPCModel key={npc.id} npc={npc} />
      ))}
    </>
  );
});
