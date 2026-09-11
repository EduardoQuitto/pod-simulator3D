import { motion } from 'framer-motion';

interface Props { onBack: () => void; }

export function HowItWorksScreen({ onBack }: Props) {
  const rules = [
    { icon: '🎮', title: 'Controles', text: 'WASD = andar | Mouse = olhar | Shift = correr | E = interagir | Clique para travar o cursor' },
    { icon: '🏫', title: 'Exploração', text: 'Ande pela escola 3D, entre em salas, encontre objetos e converse com NPCs.' },
    { icon: '📊', title: 'Recursos', text: 'Gerencie dinheiro, saúde, energia, ansiedade e dependência. Cada escolha afeta esses valores.' },
    { icon: '🎲', title: 'Eventos', text: 'Eventos aleatórios aparecem. A pressão social, tentação e consequências são reais.' },
    { icon: '🎯', title: 'Objetivos', text: 'Siga os objetivos no HUD. Cada horário tem uma nova missão.' },
    { icon: '⚠️', title: 'Mensagem', text: 'Este jogo é uma sátira educativa. O objetivo é mostrar como pequenas decisões criam um ciclo de dependência.' },
  ];

  return (
    <div className="info-screen-3d">
      <motion.div className="info-screen-3d__content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2>COMO JOGAR</h2>
        <p className="info-intro">Explore uma escola 3D, tome decisões e descubra como o ciclo de dependência funciona.</p>
        <div className="info-rules">
          {rules.map((r, i) => (
            <motion.div key={r.title} className="info-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
              <span className="info-card__icon">{r.icon}</span>
              <div><h3>{r.title}</h3><p>{r.text}</p></div>
            </motion.div>
          ))}
        </div>
        <motion.button className="menu-3d-btn menu-3d-btn--secondary" onClick={onBack} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>VOLTAR</motion.button>
      </motion.div>
    </div>
  );
}

export function CreditsScreen({ onBack }: Props) {
  return (
    <div className="info-screen-3d">
      <motion.div className="info-screen-3d__content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2>CRÉDITOS</h2>
        <div className="credits-card-3d">
          <h3>POD SIMULATOR 3D</h3>
          <div><p className="credits-label">Criado por</p><p className="credits-name">Dev</p></div>
          <div><p className="credits-label">Tipo de projeto</p><p className="credits-type">Projeto experimental / jogo satírico</p></div>
          <div className="credits-disclaimer">
            <p>Este jogo é uma sátira educativa sobre o uso de cigarros eletrônicos. Não representa marcas reais, não incentiva o consumo de nicotina e não retrata pessoas reais.</p>
            <p>O objetivo é demonstrar, por meio de humor e mecânicas de gerenciamento, como o consumo pode virar um ciclo de dependência.</p>
          </div>
        </div>
        <motion.button className="menu-3d-btn menu-3d-btn--secondary" onClick={onBack} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>VOLTAR</motion.button>
      </motion.div>
    </div>
  );
}

export function StatsScreen3D({ onBack }: Props) {
  const STORAGE_KEY = 'pod-simulator-3d-stats';
  let stats = { totalGames: 0, bestScore: 0, lowestDependency: 100, highestMoney: 0, bestEnding: 'Nenhum' };
  try { const d = localStorage.getItem(STORAGE_KEY); if (d) stats = JSON.parse(d); } catch {}

  const items = [
    { icon: '🎮', label: 'Partidas', value: stats.totalGames.toString() },
    { icon: '🏆', label: 'Maior pontuação', value: stats.bestScore.toString() },
    { icon: '🔗', label: 'Menor dependência', value: `${stats.lowestDependency}%` },
    { icon: '💰', label: 'Maior dinheiro', value: `R$ ${stats.highestMoney},00` },
    { icon: '🏅', label: 'Melhor final', value: stats.bestEnding },
  ];

  const reset = () => { localStorage.removeItem(STORAGE_KEY); window.location.reload(); };

  return (
    <div className="info-screen-3d">
      <motion.div className="info-screen-3d__content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2>ESTATÍSTICAS</h2>
        <div className="stats-grid-3d">
          {items.map((item, i) => (
            <motion.div key={item.label} className="stat-card-3d" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
              <span>{item.icon}</span>
              <div><p className="stat-label">{item.label}</p><p className="stat-value">{item.value}</p></div>
            </motion.div>
          ))}
        </div>
        <div className="stats-actions-3d">
          <motion.button className="menu-3d-btn menu-3d-btn--secondary" onClick={onBack} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>VOLTAR</motion.button>
          <motion.button className="menu-3d-btn menu-3d-btn--danger" onClick={reset} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>LIMPAR DADOS</motion.button>
        </div>
      </motion.div>
    </div>
  );
}
