import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAYER_HEIGHT, PLAYER_RADIUS, SPRINT_MULTIPLIER } from '../data/school';
import type { WallDef } from '../types/game';

const keys: Record<string, boolean> = {};
const _dir = new THREE.Vector3();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');

function checkCollisions(pos: THREE.Vector3, radius: number, walls: WallDef[]): THREE.Vector3 {
  const result = pos.clone();
  for (const wall of walls) {
    const hw = wall.size[0] / 2;
    const hd = wall.size[2] / 2;
    const wMinX = wall.position[0] - hw;
    const wMaxX = wall.position[0] + hw;
    const wMinZ = wall.position[2] - hd;
    const wMaxZ = wall.position[2] + hd;
    const closestX = Math.max(wMinX, Math.min(result.x, wMaxX));
    const closestZ = Math.max(wMinZ, Math.min(result.z, wMaxZ));
    const dx = result.x - closestX;
    const dz = result.z - closestZ;
    const distSq = dx * dx + dz * dz;
    if (distSq < radius * radius) {
      const dist = Math.sqrt(distSq);
      if (dist > 0.001) {
        result.x += (dx / dist) * (radius - dist);
        result.z += (dz / dist) * (radius - dist);
      } else {
        const overlapX = radius - Math.abs(result.x - closestX);
        const overlapZ = radius - Math.abs(result.z - closestZ);
        if (overlapX > 0 && overlapZ > 0) {
          if (overlapX < overlapZ) result.x += result.x < closestX ? -overlapX : overlapX;
          else result.z += result.z < closestZ ? -overlapZ : overlapZ;
        }
      }
    }
  }
  return result;
}

export function usePlayer(walls: WallDef[], enabled: boolean) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isLocked = useRef(false);

  useEffect(() => {
    camera.position.set(0, PLAYER_HEIGHT, -18);
    _euler.setFromQuaternion(camera.quaternion);
    yaw.current = 0;
    pitch.current = 0;
  }, [camera]);

  useEffect(() => {
    if (!enabled) {
      document.exitPointerLock();
      isLocked.current = false;
    }
  }, [enabled]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { keys[e.code] = true; };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      yaw.current -= e.movementX * 0.002;
      pitch.current -= e.movementY * 0.002;
      pitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch.current));
    };
    const onClick = () => {
      if (!isLocked.current && enabled) {
        gl.domElement.requestPointerLock();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);
    gl.domElement.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      gl.domElement.removeEventListener('click', onClick);
    };
  }, [gl, enabled]);

  useFrame((_, delta) => {
    if (!enabled || !isLocked.current) return;

    _euler.set(0, yaw.current, 0);
    _dir.set(0, 0, 0);

    if (keys['KeyW'] || keys['ArrowUp']) _dir.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) _dir.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) _dir.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) _dir.x += 1;

    if (_dir.lengthSq() > 0) {
      _dir.normalize();
      _dir.applyEuler(_euler);
      const isSprinting = keys['ShiftLeft'] || keys['ShiftRight'];
      const speed = (isSprinting ? 5.5 : 3) * SPRINT_MULTIPLIER;
      const newPos = camera.position.clone();
      newPos.x += _dir.x * speed * delta;
      newPos.z += _dir.z * speed * delta;
      newPos.y = PLAYER_HEIGHT;
      const adjusted = checkCollisions(newPos, PLAYER_RADIUS, walls);
      camera.position.copy(adjusted);
    }

    _euler.set(pitch.current, yaw.current, 0);
    camera.quaternion.setFromEuler(_euler);
  });

  const lock = useCallback(() => {
    if (!isLocked.current && enabled) gl.domElement.requestPointerLock();
  }, [gl, enabled]);

  return { isLocked: isLocked.current, lock, camera };
}
