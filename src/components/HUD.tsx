import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Resources, GameStage } from '../types/game';
import { STAGE_NAMES, TIME_SLOTS } from '../data/school';

interface HUDProps {
  resources: Resources;
  stage: GameStage;
  timeSlotIndex: number;
  objective: string;
  interactPrompt: string | null;
  actionFeedback: string | null;
  stoppedAt: string | null;
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

export function HUD({ resources, stage, timeSlotIndex, objective, interactPrompt, actionFeedback, stoppedAt }: HUDProps) {
  const [isLocked, setIsLocked] = useState(!!document.pointerLockElement);
  const progress = ((timeSlotIndex + 1) / TIME_SLOTS.length) * 100;

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
        {!isLocked && (
          <motion.div className="hud__resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleResume}>
            <div className="hud__resume-box">
              <span className="hud__resume-icon">🎮</span>
              <span className="hud__resume-text">Clique para continuar</span>
              <span className="hud__resume-hint">WASD = andar | Mouse = olhar | E = interagir</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hud__controls">
        <span>WASD</span> andar
        <span>MOUSE</span> olhar
        <span>E</span> interagir
        <span>SHIFT</span> correr
      </div>
    </div>
  );
}
