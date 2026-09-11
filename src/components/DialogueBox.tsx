import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DialogueLine } from '../types/game';

interface DialogueBoxProps {
  lines: DialogueLine[];
  step: number;
  onResponse: (effect: Record<string, number>, feedback: string) => void;
  onClose: () => void;
}

export function DialogueBox({ lines, step, onResponse, onClose }: DialogueBoxProps) {
  if (step >= lines.length) return null;
  const current = lines[step];
  const hasResponses = current.responses && current.responses.length > 0;
  const isLastLine = step >= lines.length - 1 && !hasResponses;

  useEffect(() => {
    if (!hasResponses) return;
    const handleKey = (e: KeyboardEvent) => {
      const responses = current.responses!;
      if (e.key === '1' && responses[0]) onResponse(responses[0].effect as Record<string, number>, responses[0].feedback);
      if (e.key === '2' && responses[1]) onResponse(responses[1].effect as Record<string, number>, responses[1].feedback);
      if (e.key === '3' && responses[2]) onResponse(responses[2].effect as Record<string, number>, responses[2].feedback);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, hasResponses, current, onResponse]);

  useEffect(() => {
    if (hasResponses) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasResponses, onClose]);

  return (
    <AnimatePresence>
      <motion.div className="dialogue-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="dialogue-box" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}>
          <div className="dialogue-box__speaker">{current.speaker}</div>
          <p className="dialogue-box__text">{current.text}</p>

          {hasResponses && (
            <div className="dialogue-box__responses">
              {current.responses!.map((resp, i) => (
                <motion.button key={i} className="dialogue-box__response" onClick={() => onResponse(resp.effect as Record<string, number>, resp.feedback)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <span className="response-key">{i + 1}</span>
                  {resp.text}
                </motion.button>
              ))}
            </div>
          )}

          {!hasResponses && (
            <div className="dialogue-box__actions">
              <motion.button className="dialogue-box__continue" onClick={onClose} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {isLastLine ? 'FECHAR' : 'CONTINUAR'} <span className="key-hint">ENTER</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
