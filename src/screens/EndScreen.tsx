import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameState, Ending, Stats } from '../types/game';

interface EndScreenProps {
  state: GameState;
  ending: Ending;
  duration: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

const STORAGE_KEY = 'pod-simulator-3d-stats';

function saveStats(state: GameState, ending: Ending) {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const stats: Stats = data ? JSON.parse(data) : { totalGames: 0, bestScore: 0, lowestDependency: 100, highestMoney: 0, bestEnding: 'Nenhum' };
    const score = Math.round(state.resources.health + state.resources.energy + (100 - state.resources.dependency) + state.resources.money * 2 + (100 - state.resources.anxiety));
    stats.totalGames += 1;
    stats.bestScore = Math.max(stats.bestScore, score);
    stats.lowestDependency = Math.min(stats.lowestDependency, state.resources.dependency);
    stats.highestMoney = Math.max(stats.highestMoney, state.resources.money);
    const rank: Record<string, number> = { 'EU NÃO PRECISO DISSO': 5, PAROU: 4, 'SÓ DE VEZ EM QUANDO': 3, 'FIM DO DIA': 2, CICLO: 1, EXCESSO: 0 };
    if ((rank[ending.name] ?? 0) > (rank[stats.bestEnding] ?? 0)) stats.bestEnding = ending.name;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

function formatDuration(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`; }

function getClassification(c: string) {
  switch (c) {
    case 'green': return { emoji: '🟢', text: 'VOCÊ ESCAPOU', cls: 'classification--green' };
    case 'yellow': return { emoji: '🟡', text: 'QUASE ENTROU NO CICLO', cls: 'classification--yellow' };
    case 'red': return { emoji: '🔴', text: 'O POD VENCEU', cls: 'classification--red' };
    default: return { emoji: '⚪', text: '', cls: '' };
  }
}

export function EndScreen({ state, ending, duration, onPlayAgain, onMainMenu }: EndScreenProps) {
  useEffect(() => { saveStats(state, ending); }, [state, ending]);

  const cls = getClassification(ending.classification);

  const stats = [
    { label: 'Dinheiro', value: `R$ ${state.resources.money},00` },
    { label: 'Saúde', value: `${Math.round(state.resources.health)}%` },
    { label: 'Dependência', value: `${Math.round(state.resources.dependency)}%` },
    { label: 'Ansiedade', value: `${Math.round(state.resources.anxiety)}%` },
    { label: 'Energia', value: `${Math.round(state.resources.energy)}%` },
    { label: 'Usos', value: state.uses.toString() },
    { label: 'Compras', value: state.buys.toString() },
    { label: 'Duração', value: formatDuration(duration) },
  ];

  return (
    <div className="end-screen-3d">
      <motion.div className="end-screen-3d__content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <motion.div className={`classification ${cls.cls}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <span>{cls.emoji}</span>
          <span>{cls.text}</span>
        </motion.div>

        <motion.h1 className="end-screen-3d__title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          FINAL: {ending.name}
        </motion.h1>

        <motion.div className="end-screen-3d__message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {ending.message.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </motion.div>

        <motion.div className="end-screen-3d__stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <h3>RESUMO DA PARTIDA</h3>
          <div className="end-stats-grid">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="end-stat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.08 }}>
                <span className="end-stat__label">{s.label}</span>
                <span className="end-stat__value">{s.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="end-screen-3d__buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <motion.button className="menu-3d-btn menu-3d-btn--primary" onClick={onPlayAgain} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            JOGAR NOVAMENTE
          </motion.button>
          <motion.button className="menu-3d-btn menu-3d-btn--secondary" onClick={onMainMenu} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            MENU PRINCIPAL
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
