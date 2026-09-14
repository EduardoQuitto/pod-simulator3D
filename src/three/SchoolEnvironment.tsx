import React, { memo, useMemo } from 'react';
import * as THREE from 'three';
import { WALLS, FURNITURE, INTERACTIVE_OBJECTS } from '../data/school';
import {
  createFloorTexture, createFloorBumpTexture, createWallTexture,
  createWallBumpTexture, createWoodTexture, createMetalTexture,
  createBlackboardTexture, createCeilingTexture,
} from './textures';

function FloorTiles() {
  const [floorTex, floorBump, ceilTex] = useMemo(() => [
    createFloorTexture(), createFloorBumpTexture(), createCeilingTexture(),
  ], []);

  const tiles = useMemo(() => {
    const t: React.JSX.Element[] = [];
    for (let x = -16; x <= 12; x += 2) {
      for (let z = -22; z <= 34; z += 2) {
        const dark = (x + z) % 4 === 0;
        t.push(
          <mesh key={`t-${x}-${z}`} position={[x + 1, 0.005, z + 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1.95, 1.95]} />
            <meshStandardMaterial
              color={dark ? '#4a4540' : '#524d48'}
              roughness={0.72}
              metalness={0.03}
              map={floorTex}
              bumpMap={floorBump}
              bumpScale={0.015}
              envMapIntensity={0.35}
            />
          </mesh>
        );
      }
    }
    return t;
  }, [floorTex, floorBump]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[60, 70]} />
        <meshStandardMaterial color="#3a3835" roughness={0.85} metalness={0.01} map={floorTex} bumpMap={floorBump} bumpScale={0.02} />
      </mesh>
      {tiles}
    </group>
  );
}

function Ceiling() {
  const ceilTex = useMemo(() => createCeilingTexture(), []);
  const lights = useMemo(() => {
    const l: React.JSX.Element[] = [];
    for (let z = -18; z <= 18; z += 6) {
      l.push(
        <group key={`cl-${z}`}>
          <mesh position={[0, 3.18, z]}>
            <boxGeometry args={[0.3, 0.06, 2]} />
            <meshStandardMaterial color="#ffffff" emissive="#fff8e8" emissiveIntensity={1.8} roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, 3.22, z]}>
            <boxGeometry args={[0.35, 0.02, 2.1]} />
            <meshStandardMaterial color="#e8e4e0" metalness={0.5} roughness={0.25} envMapIntensity={0.6} />
          </mesh>
          <mesh position={[0, 3.15, z]}>
            <boxGeometry args={[0.28, 0.02, 1.95]} />
            <meshStandardMaterial color="#f0ece5" roughness={0.6} />
          </mesh>
        </group>
      );
    }
    return l;
  }, []);

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.25, 0]} receiveShadow>
        <planeGeometry args={[60, 70]} />
        <meshStandardMaterial color="#e8e4e0" roughness={0.88} metalness={0.0} map={ceilTex} />
      </mesh>
      {lights}
    </group>
  );
}

function Wall({ position, size, color = '#e8e4df' }: { position: [number, number, number]; size: [number, number, number]; color?: string }) {
  const [wallTex, wallBump] = useMemo(() => [createWallTexture(), createWallBumpTexture()], []);
  return (
    <group>
      <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.78} metalness={0.01} map={wallTex} bumpMap={wallBump} bumpScale={0.008} envMapIntensity={0.25} />
      </mesh>
      <mesh position={[position[0], 0.08, position[2]]}>
        <boxGeometry args={[size[0] + 0.02, 0.16, size[2] + 0.02]} />
        <meshStandardMaterial color="#c0b8a8" roughness={0.6} metalness={0.03} envMapIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Desk({ position, size = [1.2, 0.8, 0.8], color = '#8B6914' }: { position: [number, number, number]; size?: [number, number, number]; color?: string }) {
  const woodTex = useMemo(() => {
    const tex = createWoodTexture();
    tex.repeat.set(size[0] * 2, size[2] * 2);
    return tex;
  }, [size[0], size[2]]);
  return (
    <group position={position}>
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.06} map={woodTex} envMapIntensity={0.5} />
      </mesh>
      {[[-size[0]/2+0.05, 0, -size[2]/2+0.05], [size[0]/2-0.05, 0, -size[2]/2+0.05], [-size[0]/2+0.05, 0, size[2]/2-0.05], [size[0]/2-0.05, 0, size[2]/2-0.05]].map((p, i) => (
        <mesh key={i} position={[p[0], size[1]/2 - 0.02, p[2]]}>
          <boxGeometry args={[0.05, size[1] - 0.04, 0.05]} />
          <meshStandardMaterial color="#5a3a20" roughness={0.7} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function Chair({ position }: { position: [number, number, number] }) {
  const woodTex = useMemo(() => createWoodTexture(), []);
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color="#A0722D" roughness={0.5} metalness={0.06} map={woodTex} envMapIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.55, -0.2]} castShadow>
        <boxGeometry args={[0.45, 0.5, 0.05]} />
        <meshStandardMaterial color="#A0722D" roughness={0.5} metalness={0.06} map={woodTex} envMapIntensity={0.4} />
      </mesh>
      {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]}>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshStandardMaterial color="#5a3a20" roughness={0.75} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function Blackboard({ position, size = [4, 1.2, 0.1] }: { position: [number, number, number]; size?: [number, number, number] }) {
  const bbTex = useMemo(() => createBlackboardTexture(), []);
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[size[0] + 0.15, size[1] + 0.15, 0.06]} />
        <meshStandardMaterial color="#4a2a15" roughness={0.7} metalness={0.06} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#2a4a22" roughness={0.35} metalness={0.0} map={bbTex} envMapIntensity={0.2} />
      </mesh>
      <mesh position={[0, -size[1]/2 - 0.02, 0.06]}>
        <boxGeometry args={[size[0] * 0.6, 0.06, 0.12]} />
        <meshStandardMaterial color="#d0c8b0" roughness={0.5} metalness={0.12} />
      </mesh>
    </group>
  );
}

function Locker({ position, color = '#607080' }: { position: [number, number, number]; color?: string }) {
  const metalTex = useMemo(() => createMetalTexture(), []);
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.6, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.55} map={metalTex} envMapIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.31]}>
        <boxGeometry args={[0.36, 1.52, 0.01]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.85)} roughness={0.22} metalness={0.6} map={metalTex} envMapIntensity={0.8} />
      </mesh>
      <mesh position={[0.15, 0.3, 0.32]}>
        <boxGeometry args={[0.04, 0.08, 0.02]} />
        <meshStandardMaterial color="#aaa" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0.15, -0.1, 0.32]}>
        <boxGeometry args={[0.04, 0.08, 0.02]} />
        <meshStandardMaterial color="#aaa" metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  );
}

function VendingMachine({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.8, 0.8]} />
        <meshStandardMaterial color="#2a3a4a" roughness={0.2} metalness={0.45} envMapIntensity={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0.41]}>
        <boxGeometry args={[0.4, 0.8, 0.02]} />
        <meshStandardMaterial color="#0a1520" roughness={0.02} metalness={0.15} />
      </mesh>
      <mesh position={[0.18, 1.2, 0.41]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.4, 0.41]}>
        <boxGeometry args={[0.3, 0.2, 0.02]} />
        <meshStandardMaterial color="#1a2a3a" metalness={0.35} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Bench({ position, size }: { position: [number, number, number]; size?: [number, number, number] }) {
  const w = size?.[0] ?? 2;
  const woodTex = useMemo(() => {
    const tex = createWoodTexture();
    tex.repeat.set(w * 2, 1);
    return tex;
  }, [w]);
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.08, 0.5]} />
        <meshStandardMaterial color="#6b4226" roughness={0.55} metalness={0.04} map={woodTex} envMapIntensity={0.35} />
      </mesh>
      <mesh position={[-w/2 + 0.15, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.5]} />
        <meshStandardMaterial color="#4a3018" roughness={0.7} metalness={0.03} />
      </mesh>
      <mesh position={[w/2 - 0.15, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.5]} />
        <meshStandardMaterial color="#4a3018" roughness={0.7} metalness={0.03} />
      </mesh>
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 3, 12]} />
        <meshStandardMaterial color="#4a2a10" roughness={0.88} metalness={0.02} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#2a6a1a" roughness={0.82} metalness={0.0} />
      </mesh>
      <mesh position={[0.6, 3, 0.4]} castShadow>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial color="#3a7a2a" roughness={0.82} />
      </mesh>
    </group>
  );
}

function Stall({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.6, 0.8]} />
        <meshStandardMaterial color="#b8b8b8" roughness={0.28} metalness={0.3} envMapIntensity={0.6} />
      </mesh>
      <mesh position={[0.5, 0, 0.41]}>
        <boxGeometry args={[0.18, 0.18, 0.02]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Sink({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.15} metalness={0.45} envMapIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.6, 0.21]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 10]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.1} />
      </mesh>
    </group>
  );
}

function TrashCan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.8, 16]} />
        <meshStandardMaterial color="#3a4a3a" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
        <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.35} />
      </mesh>
    </group>
  );
}

function WindowMesh({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1.6, 1.4, 0.12]} />
        <meshStandardMaterial color="#d0ccc5" roughness={0.55} metalness={0.03} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[1.4, 1.2, 0.02]} />
        <meshPhysicalMaterial
          color="#a0c8e8"
          transparent
          opacity={0.18}
          roughness={0.02}
          metalness={0.12}
          transmission={0.75}
          thickness={0.8}
          ior={1.52}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[0.04, 1.2, 0.03]} />
        <meshStandardMaterial color="#d0ccc5" roughness={0.45} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[1.4, 0.04, 0.03]} />
        <meshStandardMaterial color="#d0ccc5" roughness={0.45} metalness={0.02} />
      </mesh>
    </group>
  );
}

function DoorFrame({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const woodTex = useMemo(() => createWoodTexture(), []);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 2.8, 0]} castShadow>
        <boxGeometry args={[1.5, 0.12, 0.18]} />
        <meshStandardMaterial color="#5a3a18" roughness={0.55} metalness={0.06} map={woodTex} envMapIntensity={0.3} />
      </mesh>
      <mesh position={[-0.72, 1.4, 0]} castShadow>
        <boxGeometry args={[0.08, 2.8, 0.14]} />
        <meshStandardMaterial color="#5a3a18" roughness={0.55} metalness={0.06} map={woodTex} envMapIntensity={0.3} />
      </mesh>
      <mesh position={[0.72, 1.4, 0]} castShadow>
        <boxGeometry args={[0.08, 2.8, 0.14]} />
        <meshStandardMaterial color="#5a3a18" roughness={0.55} metalness={0.06} map={woodTex} envMapIntensity={0.3} />
      </mesh>
      <mesh position={[0.55, 1.4, 0.08]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#b89040" metalness={0.9} roughness={0.12} />
      </mesh>
    </group>
  );
}

function PodObject({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.25, 14]} />
        <meshStandardMaterial color="#7a7a8a" roughness={0.22} metalness={0.6} envMapIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.08, 14]} />
        <meshStandardMaterial color="#5a5a6a" roughness={0.18} metalness={0.7} />
      </mesh>
    </group>
  );
}

function BackpackObject({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.5, 0.3]} />
        <meshStandardMaterial color="#2a4a7a" roughness={0.82} metalness={0.03} />
      </mesh>
      <mesh position={[0, 0.3, 0.16]}>
        <boxGeometry args={[0.2, 0.15, 0.02]} />
        <meshStandardMaterial color="#1a3a6a" roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.1, 0.16]}>
        <boxGeometry args={[0.12, 0.06, 0.02]} />
        <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

function PhoneObject({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.02, 0.08]} />
        <meshStandardMaterial color="#0a0a15" roughness={0.08} metalness={0.7} envMapIntensity={1.0} />
      </mesh>
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.13, 0.005, 0.06]} />
        <meshStandardMaterial color="#2a4a8a" emissive="#2a4a8a" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function BookObject({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.3, 0.15]} />
        <meshStandardMaterial color="#7a2a2a" roughness={0.78} metalness={0.03} />
      </mesh>
      <mesh position={[0, 0, 0.076]}>
        <boxGeometry args={[0.18, 0.28, 0.005]} />
        <meshStandardMaterial color="#f0e8d0" roughness={0.88} />
      </mesh>
    </group>
  );
}

function InteractiveObjectMesh({ obj }: { obj: typeof INTERACTIVE_OBJECTS[number] }) {
  const pos: [number, number, number] = obj.position;
  switch (obj.type) {
    case 'pod': return <PodObject position={pos} />;
    case 'backpack': return obj.id === 'book' ? <BookObject position={pos} /> : <BackpackObject position={pos} />;
    case 'phone': return <PhoneObject position={pos} />;
    case 'vending': return <VendingMachine position={pos} />;
    case 'bench': return <Bench position={pos} />;
    case 'trashCan': return <TrashCan position={pos} />;
    default: return null;
  }
}

function FurnitureMesh({ item }: { item: typeof FURNITURE[number] }) {
  const pos: [number, number, number] = item.position;
  switch (item.type) {
    case 'desk': return <Desk position={pos} size={item.size as [number, number, number]} color={item.color} />;
    case 'chair': return <Chair position={pos} />;
    case 'blackboard': return <Blackboard position={pos} size={item.size as [number, number, number]} />;
    case 'teacherDesk': return <Desk position={pos} size={item.size as [number, number, number]} color={item.color || '#5a3a20'} />;
    case 'locker': return <Locker position={pos} color={item.color} />;
    case 'vending': return <VendingMachine position={pos} />;
    case 'bench': return <Bench position={pos} size={item.size as [number, number, number]} />;
    case 'tree': return <Tree position={pos} />;
    case 'stall': return <Stall position={pos} />;
    case 'sink': return <Sink position={pos} />;
    case 'trashCan': return <TrashCan position={pos} />;
    default: return null;
  }
}

function CorridorWindows() {
  const windows: React.JSX.Element[] = [];
  for (let z = -18; z <= 18; z += 4) {
    windows.push(
      <WindowMesh key={`wl-${z}`} position={[-2.08, 2, z]} rotation={[0, Math.PI / 2, 0]} />,
      <WindowMesh key={`wr-${z}`} position={[2.08, 2, z]} rotation={[0, -Math.PI / 2, 0]} />
    );
  }
  return <>{windows}</>;
}

function DoorFrames() {
  return (
    <>
      <DoorFrame position={[-2, 0, -3.5]} rotation={[0, Math.PI / 2, 0]} />
      <DoorFrame position={[-2, 0, 6.5]} rotation={[0, Math.PI / 2, 0]} />
      <DoorFrame position={[2, 0, -13.5]} rotation={[0, Math.PI / 2, 0]} />
      <DoorFrame position={[2, 0, -6.5]} rotation={[0, Math.PI / 2, 0]} />
      <DoorFrame position={[2, 0, 2.5]} rotation={[0, Math.PI / 2, 0]} />
      <DoorFrame position={[2, 0, 11.5]} rotation={[0, Math.PI / 2, 0]} />
      <DoorFrame position={[2, 0, 18]} rotation={[0, Math.PI / 2, 0]} />
      <DoorFrame position={[0, 0, -20]} />
      <DoorFrame position={[0, 0, 20]} />
    </>
  );
}

function RoomLabels() {
  const labels = [
    { text: 'SALA 1', pos: [6, 2.8, -10.9] as [number, number, number] },
    { text: 'SALA 2', pos: [6, 2.8, -3.9] as [number, number, number] },
    { text: 'SALA 3', pos: [6, 2.8, 5.1] as [number, number, number] },
    { text: 'LAB', pos: [6, 2.8, 14.1] as [number, number, number] },
    { text: 'BAN', pos: [-5, 2.8, -1.4] as [number, number, number] },
    { text: 'GYM', pos: [-11, 2.8, 14.1] as [number, number, number] },
    { text: 'BIB', pos: [6.5, 2.8, 30.1] as [number, number, number] },
  ];
  return (
    <>
      {labels.map((l) => (
        <mesh key={l.text} position={l.pos}>
          <boxGeometry args={[1.2, 0.25, 0.05]} />
          <meshStandardMaterial color="#3a5a7a" roughness={0.45} metalness={0.15} envMapIntensity={0.4} />
        </mesh>
      ))}
    </>
  );
}

export const SchoolEnvironment = memo(function SchoolEnvironment() {
  const walls = useMemo(() => WALLS.map((w, i) => <Wall key={`w-${i}`} {...w} />), []);
  const furniture = useMemo(() => FURNITURE.map((f, i) => <FurnitureMesh key={`f-${i}`} item={f} />), []);
  const objects = useMemo(() => INTERACTIVE_OBJECTS.map((o, i) => <InteractiveObjectMesh key={`o-${i}`} obj={o} />), []);

  return (
    <group>
      <FloorTiles />
      <Ceiling />
      {walls}
      {furniture}
      {objects}
      <CorridorWindows />
      <DoorFrames />
      <RoomLabels />
    </group>
  );
});
