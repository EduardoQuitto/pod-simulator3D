import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameEvent } from '../types/game';

interface EventModalProps {
  event: GameEvent;
  onChoose: (effect: Partial<Record<string, number>>, feedback: string) => void;
  onDismiss: () => void;
}

export function EventModal({ event, onChoose, onDismiss }: EventModalProps) {
  const hasChoices = event.choices && event.choices.length > 0;

  useEffect(() => {
    if (!hasChoices) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          onDismiss();
        }
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }

    const handleKey = (e: KeyboardEvent) => {
      const choices = event.choices!;
      if (e.key === '1' && choices[0]) onChoose(choices[0].effect, choices[0].feedback);
      if (e.key === '2' && choices[1]) onChoose(choices[1].effect, choices[1].feedback);
      if (e.key === '3' && choices[2]) onChoose(choices[2].effect, choices[2].feedback);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [event, hasChoices, onChoose, onDismiss]);

  return (
    <AnimatePresence>
      <motion.div className="event-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="event-card" initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}>
          <div className="event-card__icon">{event.icon}</div>
          <h3 className="event-card__title">{event.title}</h3>
          <p className="event-card__description">{event.description}</p>

          {hasChoices && (
            <div className="event-card__choices">
              {event.choices!.map((choice, i) => (
                <motion.button key={i} className="event-card__choice" onClick={() => onChoose(choice.effect, choice.feedback)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <span className="response-key">{i + 1}</span>
                  {choice.text}
                </motion.button>
              ))}
            </div>
          )}

          {!hasChoices && (
            <motion.button className="event-card__dismiss" onClick={onDismiss} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              ENTENDI <span className="key-hint">ENTER</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
