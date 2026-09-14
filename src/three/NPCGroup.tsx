import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { NPCS } from '../data/school';

const SKIN_COLOR = '#e8c9a0';

function NPCModel({ npc }: { npc: typeof NPCS[number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const bobOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 1.5 + bobOffset.current) * 0.015;
  });

  const hairColor = new THREE.Color(npc.bodyColor).multiplyScalar(0.35);
  const pantsColor = new THREE.Color(npc.bodyColor).multiplyScalar(0.55);
  const shoeColor = new THREE.Color('#1a1a1a');
  const shirtColor = new THREE.Color(npc.bodyColor);
  const skinMat = { color: SKIN_COLOR, roughness: 0.45, metalness: 0.0 };

  return (
    <group ref={groupRef} position={npc.position}>
      {/* Shoes */}
      <mesh position={[-0.1, 0.06, 0.02]} castShadow>
        <boxGeometry args={[0.13, 0.12, 0.2]} />
        <meshStandardMaterial color={shoeColor} roughness={0.75} metalness={0.05} />
      </mesh>
      <mesh position={[0.1, 0.06, 0.02]} castShadow>
        <boxGeometry args={[0.13, 0.12, 0.2]} />
        <meshStandardMaterial color={shoeColor} roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Legs/Pants */}
      <mesh position={[-0.1, 0.32, 0]} castShadow>
        <boxGeometry args={[0.14, 0.42, 0.14]} />
        <meshStandardMaterial color={pantsColor} roughness={0.78} metalness={0.02} />
      </mesh>
      <mesh position={[0.1, 0.32, 0]} castShadow>
        <boxGeometry args={[0.14, 0.42, 0.14]} />
        <meshStandardMaterial color={pantsColor} roughness={0.78} metalness={0.02} />
      </mesh>

      {/* Torso/Shirt */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.36, 0.46, 0.2]} />
        <meshStandardMaterial color={shirtColor} roughness={0.65} metalness={0.03} />
      </mesh>

      {/* Collar detail */}
      <mesh position={[0, 0.97, 0.08]}>
        <boxGeometry args={[0.18, 0.04, 0.06]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.55} metalness={0.02} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.24, 0.68, 0]} castShadow>
        <boxGeometry args={[0.1, 0.38, 0.1]} />
        <meshStandardMaterial color={shirtColor} roughness={0.65} metalness={0.03} />
      </mesh>
      <mesh position={[0.24, 0.68, 0]} castShadow>
        <boxGeometry args={[0.1, 0.38, 0.1]} />
        <meshStandardMaterial color={shirtColor} roughness={0.65} metalness={0.03} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.24, 0.46, 0]} castShadow>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial {...skinMat} />
      </mesh>
      <mesh position={[0.24, 0.46, 0]} castShadow>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial {...skinMat} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 8]} />
        <meshStandardMaterial {...skinMat} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={npc.color} roughness={0.5} metalness={0.01} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.28, -0.01]} castShadow>
        <sphereGeometry args={[0.14, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Eyes - whites */}
      <mesh position={[-0.045, 1.2, 0.115]}>
        <sphereGeometry args={[0.023, 10, 10]} />
        <meshStandardMaterial color="#f8f8f0" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0.045, 1.2, 0.115]}>
        <sphereGeometry args={[0.023, 10, 10]} />
        <meshStandardMaterial color="#f8f8f0" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Eyes - iris */}
      <mesh position={[-0.045, 1.2, 0.13]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#2a4a6a" roughness={0.4} />
      </mesh>
      <mesh position={[0.045, 1.2, 0.13]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#2a4a6a" roughness={0.4} />
      </mesh>

      {/* Eyes - pupils */}
      <mesh position={[-0.045, 1.2, 0.138]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[0.045, 1.2, 0.138]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Eye specular highlights */}
      <mesh position={[-0.043, 1.205, 0.14]}>
        <sphereGeometry args={[0.003, 6, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.047, 1.205, 0.14]}>
        <sphereGeometry args={[0.003, 6, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
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

      {/* Nose */}
      <mesh position={[0, 1.175, 0.14]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color={new THREE.Color(SKIN_COLOR).multiplyScalar(0.92)} roughness={0.5} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 1.145, 0.13]}>
        <boxGeometry args={[0.04, 0.008, 0.01]} />
        <meshStandardMaterial color="#c4846a" roughness={0.5} />
      </mesh>

      {/* Name tag */}
      <Html position={[0, 1.6, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(8,8,16,0.92)',
          color: '#e8e8f0',
          padding: '3px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          border: `1px solid ${npc.bodyColor}`,
          letterSpacing: '0.05em',
          boxShadow: `0 0 8px ${npc.bodyColor}40`,
        }}>
          {npc.name}
        </div>
      </Html>

      {/* Interaction indicator */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color={npc.bodyColor}
          emissive={npc.bodyColor}
          emissiveIntensity={1.0}
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
