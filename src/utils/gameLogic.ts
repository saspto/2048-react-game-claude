import type { Direction, GameState, Tile } from "../types/game";

const GRID_SIZE = 4;

let idCounter = 0;

export const createTile = (
  value: number,
  row: number,
  col: number,
  counter?: { current: number },
): Tile => {
  const id = counter ? ++counter.current : ++idCounter;
  return { id, value, row, col, isNew: true, isMerged: false };
};

const getEmptyCells = (tiles: Tile[]): { row: number; col: number }[] => {
  const occupied = new Set(tiles.map((t) => `${t.row},${t.col}`));
  const empty: { row: number; col: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!occupied.has(`${r},${c}`)) {
        empty.push({ row: r, col: c });
      }
    }
  }
  return empty;
};

const spawnTile = (tiles: Tile[], counter: { current: number }): Tile[] => {
  const empty = getEmptyCells(tiles);
  if (empty.length === 0) return tiles;
  const { row, col } = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  return [...tiles, createTile(value, row, col, counter)];
};

export const initGame = (bestScore: number): GameState => {
  const counter = { current: 0 };
  let tiles: Tile[] = [];
  tiles = spawnTile(tiles, counter);
  tiles = spawnTile(tiles, counter);
  return { tiles, score: 0, bestScore, status: "playing" };
};

const slideAndMergeRow = (
  row: (Tile | null)[],
  reverse: boolean,
): { result: (Tile | null)[]; gained: number } => {
  const line = reverse ? [...row].reverse() : [...row];

  const filled = line.filter((t): t is Tile => t !== null);

  const merged: Tile[] = [];
  let gained = 0;
  let i = 0;
  while (i < filled.length) {
    if (i + 1 < filled.length && filled[i].value === filled[i + 1].value) {
      const newValue = filled[i].value * 2;
      gained += newValue;
      merged.push({
        ...filled[i],
        value: newValue,
        isMerged: true,
        isNew: false,
      });
      i += 2;
    } else {
      merged.push({ ...filled[i], isMerged: false, isNew: false });
      i++;
    }
  }

  while (merged.length < GRID_SIZE) {
    merged.push(null as unknown as Tile);
  }

  const result = reverse ? merged.reverse() : merged;
  return { result: result as (Tile | null)[], gained };
};

export const calculateScore = (
  currentScore: number,
  gained: number,
  multiplier: number,
): number => currentScore + gained * multiplier;

export const moveBoard = (
  state: GameState,
  direction: Direction,
): GameState => {
  if (state.status === "lost") return state;

  const counter = { current: Math.max(...state.tiles.map((t) => t.id), 0) };
  const grid: (Tile | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null),
  );
  for (const tile of state.tiles) {
    grid[tile.row][tile.col] = { ...tile, isNew: false, isMerged: false };
  }

  const horizontal = direction === "left" || direction === "right";
  const reverse = direction === "right" || direction === "down";

  let totalGained = 0;
  const newGrid: (Tile | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null),
  );

  for (let i = 0; i < GRID_SIZE; i++) {
    const line = horizontal
      ? (grid[i] as (Tile | null)[])
      : (grid.map((row) => row[i]) as (Tile | null)[]);

    const { result, gained } = slideAndMergeRow(line, reverse);
    totalGained += gained;

    for (let j = 0; j < GRID_SIZE; j++) {
      if (horizontal) {
        newGrid[i][j] = result[j]
          ? { ...(result[j] as Tile), row: i, col: j }
          : null;
      } else {
        newGrid[j][i] = result[j]
          ? { ...(result[j] as Tile), row: j, col: i }
          : null;
      }
    }
  }

  const newTiles: Tile[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (newGrid[r][c] !== null) {
        newTiles.push(newGrid[r][c] as Tile);
      }
    }
  }

  const moved =
    newTiles.length !== state.tiles.length ||
    newTiles.some((t) => {
      const orig = state.tiles.find((o) => o.id === t.id);
      return !orig || orig.row !== t.row || orig.col !== t.col || t.isMerged;
    });

  if (!moved) return state;

  const tilesWithSpawn = spawnTile(newTiles, counter);

  const newScore = state.score + totalGained;
  const newBest = Math.max(state.bestScore, newScore);

  const hasWon = tilesWithSpawn.some((t) => t.value >= 2048);
  const nextStatus: GameState["status"] =
    state.status === "continue"
      ? "continue"
      : hasWon
        ? "won"
        : canMove(tilesWithSpawn)
          ? "playing"
          : "lost";

  const finalStatus =
    !canMove(tilesWithSpawn) && nextStatus !== "won" ? "lost" : nextStatus;

  return {
    tiles: tilesWithSpawn,
    score: newScore,
    bestScore: newBest,
    status: finalStatus,
  };
};

export const canMove = (tiles: Tile[]): boolean => {
  if (tiles.length < GRID_SIZE * GRID_SIZE) return true;

  const grid: number[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0),
  );
  for (const tile of tiles) {
    grid[tile.row][tile.col] = tile.value;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (c + 1 < GRID_SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < GRID_SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
  }

  return false;
};
