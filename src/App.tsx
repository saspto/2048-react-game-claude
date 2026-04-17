// 2048 Game - Built with Claude Code
import { useEffect, useRef, useCallback, useState } from "react";
import { useGame } from "./hooks/useGame";
import Board from "./components/Board";
import Score from "./components/Score";
import GameOverlay from "./components/GameOverlay";
import type { Direction } from "./types/game";
import "./App.css";

const MOBILE_BREAKPOINT = 520;
const DESKTOP_CELL = 100;
const DESKTOP_GAP = 12;
const MOBILE_CELL = 72;
const MOBILE_GAP = 8;

const getBoardConfig = (width: number) =>
  width <= MOBILE_BREAKPOINT
    ? { cellSize: MOBILE_CELL, gap: MOBILE_GAP }
    : { cellSize: DESKTOP_CELL, gap: DESKTOP_GAP };

const keyToDirection: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  s: "down",
  S: "down",
  a: "left",
  A: "left",
  d: "right",
  D: "right",
};

const App = () => {
  const { gameState, move, newGame, continueGame } = useGame();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [boardConfig, setBoardConfig] = useState(() =>
    getBoardConfig(window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => setBoardConfig(getBoardConfig(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const direction = keyToDirection[e.key];
      if (direction) {
        e.preventDefault();
        move(direction);
      }
    },
    [move],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) < 20) return;

      if (absDx > absDy) {
        move(dx > 0 ? "right" : "left");
      } else {
        move(dy > 0 ? "down" : "up");
      }
    },
    [move],
  );

  const { tiles, score, bestScore, status } = gameState;

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">2048</h1>
        <div className="header-right">
          <Score score={score} bestScore={bestScore} />
          <button className="btn btn-secondary" onClick={newGame}>
            New Game
          </button>
        </div>
      </div>
      <p className="subtitle">
        Join the tiles, get to <strong>2048!</strong>
      </p>
      <div
        className="board-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Board
          tiles={tiles}
          cellSize={boardConfig.cellSize}
          gap={boardConfig.gap}
        />
        {(status === "won" || status === "lost") && (
          <GameOverlay
            status={status}
            onContinue={status === "won" ? continueGame : undefined}
            onNewGame={newGame}
          />
        )}
      </div>
    </div>
  );
};

export default App;
