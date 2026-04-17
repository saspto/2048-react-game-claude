import { useCallback, useEffect, useState } from 'react';
import type { Direction, GameState } from '../types/game';
import { initGame, moveBoard } from '../utils/gameLogic';

const BEST_SCORE_KEY = '2048-best-score';

const loadBestScore = (): number => {
  try {
    const stored = localStorage.getItem(BEST_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

const saveBestScore = (score: number): void => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, score.toString());
  } catch {
    // ignore storage errors
  }
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => initGame(loadBestScore()));

  useEffect(() => {
    saveBestScore(gameState.bestScore);
  }, [gameState.bestScore]);

  const move = useCallback((direction: Direction) => {
    setGameState((prev) => {
      if (prev.status === 'lost') return prev;
      return moveBoard(prev, direction);
    });
  }, []);

  const newGame = useCallback(() => {
    setGameState((prev) => initGame(prev.bestScore));
  }, []);

  const continueGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, status: 'continue' }));
  }, []);

  return { gameState, move, newGame, continueGame };
};
