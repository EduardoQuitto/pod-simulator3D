import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Lighting } from '../three/Lighting';
import { SchoolEnvironment } from '../three/SchoolEnvironment';
import { NPCGroup } from '../three/NPCGroup';

interface MainMenuProps {
  onPlay: () => void;
  onHowItWorks: () => void;
  onStats: () => void;
  onCredits: () => void;
}

function MenuBackground() {
  return (
    <>
      <Lighting timeSlotIndex={2} />
      <SchoolEnvironment />
      <NPCGroup />
      <fog attach="fog" args={['#1a1a2a', 12, 40]} />
    </>
  );
}

export function MainMenu({ onPlay, onHowItWorks, onStats, onCredits }: MainMenuProps) {
  return (
    <div className="menu-screen-3d">
      <div className="menu-3d-canvas">
        <Canvas
          shadows
          camera={{ position: [8, 6, 12], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#0a0a12']} />
          <Suspense fallback={null}>
            <MenuBackground />
          </Suspense>
        </Canvas>
      </div>

      <div className="menu-3d-overlay">
        <div className="menu-3d-content">
          <motion.div
            className="menu-3d-logo"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="menu-3d-title">POD SIMULATOR</h1>
            <span className="menu-3d-subtitle-3d">3D</span>
            <p className="menu-3d-tagline">"Era só uma brincadeira..."</p>
          </motion.div>

          <motion.div
            className="menu-3d-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button className="menu-3d-btn menu-3d-btn--primary" onClick={onPlay} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              JOGAR
            </motion.button>
            <motion.button className="menu-3d-btn menu-3d-btn--secondary" onClick={onHowItWorks} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              COMO JOGAR
            </motion.button>
            <motion.button className="menu-3d-btn menu-3d-btn--secondary" onClick={onStats} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              ESTATÍSTICAS
            </motion.button>
            <motion.button className="menu-3d-btn menu-3d-btn--tertiary" onClick={onCredits} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              CRÉDITOS
            </motion.button>
          </motion.div>

          <motion.p
            className="menu-3d-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 }}
          >
            Jogo satírico educativo — Não incentive o consumo
          </motion.p>
        </div>
      </div>
    </div>
  );
}
