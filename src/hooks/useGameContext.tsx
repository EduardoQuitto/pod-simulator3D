import { createContext, useContext } from 'react';
import { useGameState, type UseGameStateReturn } from './useGameState';

const GameContext = createContext<UseGameStateReturn | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const gs = useGameState();
  return <GameContext.Provider value={gs}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
