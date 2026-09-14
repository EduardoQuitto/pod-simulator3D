import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Resources, GameStage } from '../types/game';
import { STAGE_NAMES, TIME_SLOTS } from '../data/school';
import { touchInput } from '../hooks/usePlayer';

interface HUDProps {
  resources: Resources;
  stage: GameStage;
  timeSlotIndex: number;
  objective: string;
  interactPrompt: string | null;
  actionFeedback: string | null;
  stoppedAt: string | null;
  onInteract?: () => void;
}

function ResourceMini({ icon, value, color, critical }: { icon: string; value: number; color: string; critical?: boolean }) {
  return (
    <div className="hud-resource">
      <span className="hud-resource__icon">{icon}</span>
      <div className="hud-resource__bar">
        <div className={`hud-resource__fill ${critical ? 'critical' : ''}`} style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }} />
      </div>
      <span className={`hud-resource__value ${critical ? 'critical' : ''}`}>{Math.round(value)}</span>
    </div>
  );
}

function VirtualJoystick() {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const maxDist = 40;

  const handleTouch = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - centerRef.current.x;
    const dy = clientY - centerRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    const nx = (clampedDist / maxDist) * Math.cos(angle);
    const ny = (clampedDist / maxDist) * Math.sin(angle);

    touchInput.moveX = nx;
    touchInput.moveZ = ny;

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${(clampedDist / maxDist) * maxDist * Math.cos(angle)}px, ${(clampedDist / maxDist) * maxDist * Math.sin(angle)}px)`;
    }
  }, []);

  const reset = useCallback(() => {
    touchInput.moveX = 0;
    touchInput.moveZ = 0;
    touchIdRef.current = null;
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      touchIdRef.current = t.identifier;
      const rect = el.getBoundingClientRect();
      centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      handleTouch(t.clientX, t.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touchIdRef.current) {
          handleTouch(t.clientX, t.clientY);
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          reset();
        }
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [handleTouch, reset]);

  return (
    <div ref={containerRef} className="touch-joystick">
      <div ref={knobRef} className="touch-joystick__knob" />
    </div>
  );
}

export function HUD({ resources, stage, timeSlotIndex, objective, interactPrompt, actionFeedback, stoppedAt, onInteract }: HUDProps) {
  const [isLocked, setIsLocked] = useState(!!document.pointerLockElement);
  const [isMobile, setIsMobile] = useState(false);
  const progress = ((timeSlotIndex + 1) / TIME_SLOTS.length) * 100;

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const onLockChange = () => setIsLocked(!!document.pointerLockElement);
    document.addEventListener('pointerlockchange', onLockChange);
    return () => document.removeEventListener('pointerlockchange', onLockChange);
  }, []);

  const handleResume = () => {
    document.querySelector('canvas')?.requestPointerLock();
  };

  return (
    <div className="hud">
      <div className="hud__top">
        <div className="hud__time">
          <span className="hud__day">SEGUNDA-FEIRA</span>
          <span className="hud__clock">{TIME_SLOTS[timeSlotIndex]}</span>
        </div>
        <div className="hud__stage">
          <span className="hud__stage-label">ESTÁGIO {stage}</span>
          <span className="hud__stage-name">{STAGE_NAMES[stage]}</span>
        </div>
        {stoppedAt && <div className="hud__stopped">PAROU às {stoppedAt}</div>}
      </div>

      <div className="hud__progress">
        <div className="hud__progress-bar">
          <motion.div className="hud__progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="hud__time-dots">
          {TIME_SLOTS.map((s, i) => (
            <span key={s} className={`hud__dot ${i <= timeSlotIndex ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="hud__resources">
        <ResourceMini icon="💰" value={resources.money} color="#4ade80" />
        <ResourceMini icon="❤️" value={resources.health} color="#f87171" critical={resources.health < 25} />
        <ResourceMini icon="🧠" value={resources.dependency} color="#a78bfa" critical={resources.dependency > 70} />
        <ResourceMini icon="😰" value={resources.anxiety} color="#fb923c" critical={resources.anxiety > 70} />
        <ResourceMini icon="⚡" value={resources.energy} color="#facc15" critical={resources.energy < 20} />
      </div>

      <div className="hud__objective">
        <span className="hud__objective-label">OBJETIVO</span>
        <span className="hud__objective-text">{objective}</span>
      </div>

      <AnimatePresence>
        {interactPrompt && (
          <motion.div className="hud__interact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            {interactPrompt}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {actionFeedback && (
          <motion.div className="hud__feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {actionFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLocked && !isMobile && (
          <motion.div className="hud__resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleResume}>
            <div className="hud__resume-box">
              <span className="hud__resume-icon">🎮</span>
              <span className="hud__resume-text">Clique para continuar</span>
              <span className="hud__resume-hint">WASD = andar | Mouse = olhar | E = interagir</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isMobile && (
        <div className="hud__controls">
          <span>WASD</span> andar
          <span>MOUSE</span> olhar
          <span>E</span> interagir
          <span>SHIFT</span> correr
        </div>
      )}

      {isMobile && (
        <div className="touch-controls">
          <VirtualJoystick />
          <button
            className="touch-btn touch-btn--sprint"
            onTouchStart={() => { touchInput.sprint = true; }}
            onTouchEnd={() => { touchInput.sprint = false; }}
          >
            🏃
          </button>
          <button
            className="touch-btn touch-btn--interact"
            onTouchStart={() => { if (onInteract) onInteract(); }}
          >
            [E]
          </button>
        </div>
      )}
    </div>
  );
}
