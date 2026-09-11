import { useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './hooks/useGameContext';
import { MainMenu } from './screens/MainMenu';
import { GameView } from './screens/GameView';
import { EndScreen } from './screens/EndScreen';
import { HowItWorksScreen, CreditsScreen, StatsScreen3D } from './screens/InfoScreens';
import './App.css';

function AppContent() {
  const gs = useGame();
  const { state, ending, duration } = gs;

  const handlePlay = useCallback(() => gs.startGame(), [gs.startGame]);
  const handlePlayAgain = useCallback(() => gs.startGame(), [gs.startGame]);
  const handleMainMenu = useCallback(() => { gs.reset(); gs.setScreen('menu'); }, [gs.reset, gs.setScreen]);

  return (
    <div className="app-3d">
      <AnimatePresence mode="wait">
        {state.screen === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <MainMenu onPlay={handlePlay} onHowItWorks={() => gs.setScreen('howItWorks')} onStats={() => gs.setScreen('stats')} onCredits={() => gs.setScreen('credits')} />
          </motion.div>
        )}
        {state.screen === 'howItWorks' && (
          <motion.div key="how" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <HowItWorksScreen onBack={() => gs.setScreen('menu')} />
          </motion.div>
        )}
        {state.screen === 'credits' && (
          <motion.div key="credits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <CreditsScreen onBack={() => gs.setScreen('menu')} />
          </motion.div>
        )}
        {state.screen === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <StatsScreen3D onBack={() => gs.setScreen('menu')} />
          </motion.div>
        )}
        {state.screen === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <GameView />
          </motion.div>
        )}
        {state.screen === 'end' && ending && (
          <motion.div key="end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <EndScreen state={state} ending={ending} duration={duration} onPlayAgain={handlePlayAgain} onMainMenu={handleMainMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
