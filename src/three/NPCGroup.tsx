import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { NPCS } from '../data/school';

const SKIN = '#e8c9a0';

function NPCModel({ npc }: { npc: typeof NPCS[number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const bobOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 1.2 + bobOffset.current) * 0.02;
  });

  const hairColor = new THREE.Color(npc.bodyColor).multiplyScalar(0.4);
  const pantsColor = new THREE.Color(npc.bodyColor).multiplyScalar(0.6);
  const shoeColor = new THREE.Color('#2a2a2a');
  const shirtColor = new THREE.Color(npc.bodyColor);

  return (
    <group ref={groupRef} position={npc.position}>
      {/* Shoes */}
      <mesh position={[-0.1, 0.06, 0.02]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.18]} />
        <meshStandardMaterial color={shoeColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.06, 0.02]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.18]} />
        <meshStandardMaterial color={shoeColor} roughness={0.8} />
      </mesh>

      {/* Legs/Pants */}
      <mesh position={[-0.1, 0.32, 0]} castShadow>
        <boxGeometry args={[0.14, 0.42, 0.14]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.32, 0]} castShadow>
        <boxGeometry args={[0.14, 0.42, 0.14]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>

      {/* Torso/Shirt */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.36, 0.46, 0.2]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>

      {/* Collar detail */}
      <mesh position={[0, 0.97, 0.08]}>
        <boxGeometry args={[0.18, 0.04, 0.06]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.24, 0.68, 0]} castShadow>
        <boxGeometry args={[0.1, 0.38, 0.1]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.24, 0.68, 0]} castShadow>
        <boxGeometry args={[0.1, 0.38, 0.1]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.24, 0.46, 0]} castShadow>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      <mesh position={[0.24, 0.46, 0]} castShadow>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 6]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color={npc.color} roughness={0.55} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.28, -0.01]} castShadow>
        <sphereGeometry args={[0.14, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* Eyes - whites */}
      <mesh position={[-0.045, 1.2, 0.115]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#f8f8f0" />
      </mesh>
      <mesh position={[0.045, 1.2, 0.115]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#f8f8f0" />
      </mesh>

      {/* Eyes - pupils */}
      <mesh position={[-0.045, 1.2, 0.132]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.045, 1.2, 0.132]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.045, 1.235, 0.125]}>
        <boxGeometry args={[0.04, 0.008, 0.01]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      <mesh position={[0.045, 1.235, 0.125]}>
        <boxGeometry args={[0.04, 0.008, 0.01]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 1.145, 0.13]}>
        <boxGeometry args={[0.04, 0.008, 0.01]} />
        <meshStandardMaterial color="#c4846a" />
      </mesh>

      {/* Name tag */}
      <Html position={[0, 1.6, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(10,10,18,0.85)',
          color: '#e8e8f0',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          border: `1px solid ${npc.bodyColor}`,
          letterSpacing: '0.05em',
        }}>
          {npc.name}
        </div>
      </Html>

      {/* Interaction indicator */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial
          color={npc.bodyColor}
          emissive={npc.bodyColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
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
