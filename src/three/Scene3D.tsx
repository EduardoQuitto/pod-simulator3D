import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { SchoolEnvironment } from '../three/SchoolEnvironment';
import { NPCGroup } from '../three/NPCGroup';
import { Lighting } from '../three/Lighting';
import { usePlayer } from '../hooks/usePlayer';
import { WALLS, NPCS, INTERACTIVE_OBJECTS } from '../data/school';

interface Scene3DProps {
  timeSlotIndex: number;
  enabled: boolean;
  onNearNPC: (npc: string | null) => void;
  onNearObject: (obj: string | null, prompt: string | null) => void;
  onInteract: () => void;
  objectiveLocation?: [number, number, number];
  objectiveNpc?: string;
  onObjectiveReached?: () => void;
}

interface InteractionDetectorProps {
  onNearNPC: (npc: string | null) => void;
  onNearObject: (obj: string | null, prompt: string | null) => void;
  onInteract: () => void;
  objectiveLocation?: [number, number, number];
  objectiveNpc?: string;
  onObjectiveReached?: () => void;
}

function InteractionDetector({
  onNearNPC,
  onNearObject,
  onInteract,
  objectiveLocation,
  objectiveNpc,
  onObjectiveReached,
}: InteractionDetectorProps) {
  const { camera } = useThree();
  const keysRef = useRef<Record<string, boolean>>({});
  const lastInteract = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === 'KeyE') {
        const now = Date.now();
        if (now - lastInteract.current > 300) {
          lastInteract.current = now;
          onInteract();
        }
      }
    };
    const up = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [onInteract]);

  useFrame(() => {
    const pos = camera.position;
    let nearestNPC: { id: string; dist: number } | null = null;
    let nearestObj: { id: string; name: string; dist: number } | null = null;

    for (const npc of NPCS) {
      const dx = pos.x - npc.position[0];
      const dz = pos.z - npc.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 3.5 && (!nearestNPC || dist < nearestNPC.dist)) {
        nearestNPC = { id: npc.id, dist };
      }
    }

    for (const obj of INTERACTIVE_OBJECTS) {
      const dx = pos.x - obj.position[0];
      const dz = pos.z - obj.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 2.5 && (!nearestObj || dist < nearestObj.dist)) {
        nearestObj = { id: obj.id, name: obj.name, dist };
      }
    }

    onNearNPC(nearestNPC?.id || null);
    onNearObject(nearestObj?.id || null, nearestObj ? `[E] ${nearestObj.name}` : null);

    if (objectiveLocation) {
      const dx = pos.x - objectiveLocation[0];
      const dz = pos.z - objectiveLocation[2];
      if (Math.sqrt(dx * dx + dz * dz) < 2.5) onObjectiveReached?.();
    }

    if (objectiveNpc && nearestNPC?.id === objectiveNpc && nearestNPC.dist < 3.5) {
      onObjectiveReached?.();
    }
  });

  return null;
}

export function Scene3D({
  timeSlotIndex,
  enabled,
  onNearNPC,
  onNearObject,
  onInteract,
  objectiveLocation,
  objectiveNpc,
  onObjectiveReached,
}: Scene3DProps) {
  usePlayer(WALLS, enabled);

  return (
    <>
      <Lighting timeSlotIndex={timeSlotIndex} />
      <SchoolEnvironment />
      <NPCGroup />
      <InteractionDetector
        onNearNPC={onNearNPC}
        onNearObject={onNearObject}
        onInteract={onInteract}
        objectiveLocation={objectiveLocation}
        objectiveNpc={objectiveNpc}
        onObjectiveReached={onObjectiveReached}
      />
      <fog attach="fog" args={['#1a1a2a', 20, 55]} />
    </>
  );
}
