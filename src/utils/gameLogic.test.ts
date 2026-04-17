import { initGame, moveBoard, canMove, createTile } from './gameLogic';
import type { Tile } from '../types/game';

describe('initGame', () => {
  it('creates exactly 2 tiles', () => {
    const state = initGame(0);
    expect(state.tiles).toHaveLength(2);
  });

  it('starts with score 0', () => {
    const state = initGame(0);
    expect(state.score).toBe(0);
  });

  it('preserves bestScore', () => {
    const state = initGame(500);
    expect(state.bestScore).toBe(500);
  });

  it('starts with playing status', () => {
    const state = initGame(0);
    expect(state.status).toBe('playing');
  });
});

describe('moveBoard left', () => {
  const makeTile = (value: number, row: number, col: number, id: number): Tile => ({
    id,
    value,
    row,
    col,
    isNew: false,
    isMerged: false,
  });

  it('slides tiles to the left', () => {
    const tiles = [makeTile(2, 0, 3, 1)];
    const state = { tiles, score: 0, bestScore: 0, status: 'playing' as const };
    const next = moveBoard(state, 'left');
    const moved = next.tiles.find((t) => t.id === 1);
    expect(moved?.col).toBe(0);
  });

  it('merges equal tiles moving left', () => {
    const tiles = [makeTile(2, 0, 0, 1), makeTile(2, 0, 1, 2)];
    const state = { tiles, score: 0, bestScore: 0, status: 'playing' as const };
    const next = moveBoard(state, 'left');
    const merged = next.tiles.find((t) => t.isMerged);
    expect(merged?.value).toBe(4);
    expect(merged?.col).toBe(0);
  });

  it('does not merge already merged tile again', () => {
    const tiles = [
      makeTile(2, 0, 0, 1),
      makeTile(2, 0, 1, 2),
      makeTile(2, 0, 2, 3),
    ];
    const state = { tiles, score: 0, bestScore: 0, status: 'playing' as const };
    const next = moveBoard(state, 'left');
    const mergedTiles = next.tiles.filter((t) => t.isMerged);
    expect(mergedTiles).toHaveLength(1);
    expect(mergedTiles[0].value).toBe(4);
  });
});

describe('moveBoard right', () => {
  const makeTile = (value: number, row: number, col: number, id: number): Tile => ({
    id,
    value,
    row,
    col,
    isNew: false,
    isMerged: false,
  });

  it('slides tiles to the right', () => {
    const tiles = [makeTile(2, 0, 0, 1)];
    const state = { tiles, score: 0, bestScore: 0, status: 'playing' as const };
    const next = moveBoard(state, 'right');
    const moved = next.tiles.find((t) => t.id === 1);
    expect(moved?.col).toBe(3);
  });

  it('merges equal tiles moving right', () => {
    const tiles = [makeTile(4, 1, 2, 1), makeTile(4, 1, 3, 2)];
    const state = { tiles, score: 0, bestScore: 0, status: 'playing' as const };
    const next = moveBoard(state, 'right');
    const merged = next.tiles.find((t) => t.isMerged);
    expect(merged?.value).toBe(8);
    expect(merged?.col).toBe(3);
  });
});

describe('score', () => {
  const makeTile = (value: number, row: number, col: number, id: number): Tile => ({
    id,
    value,
    row,
    col,
    isNew: false,
    isMerged: false,
  });

  it('increases score by merged tile value', () => {
    const tiles = [makeTile(8, 0, 0, 1), makeTile(8, 0, 1, 2)];
    const state = { tiles, score: 0, bestScore: 0, status: 'playing' as const };
    const next = moveBoard(state, 'left');
    expect(next.score).toBe(16);
  });

  it('updates best score if score exceeds it', () => {
    const tiles = [makeTile(512, 0, 0, 1), makeTile(512, 0, 1, 2)];
    const state = { tiles, score: 0, bestScore: 100, status: 'playing' as const };
    const next = moveBoard(state, 'left');
    expect(next.bestScore).toBe(1024);
  });
});

describe('canMove', () => {
  const makeTile = (value: number, row: number, col: number): Tile => ({
    id: Math.random(),
    value,
    row,
    col,
    isNew: false,
    isMerged: false,
  });

  it('returns true when there are empty cells', () => {
    const tiles = [makeTile(2, 0, 0)];
    expect(canMove(tiles)).toBe(true);
  });

  it('returns false when board is full with no merges possible', () => {
    const values = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    const tiles: Tile[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        tiles.push(makeTile(values[r][c], r, c));
      }
    }
    expect(canMove(tiles)).toBe(false);
  });

  it('returns true when board is full but adjacent tiles can merge', () => {
    const values = [
      [2, 2, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    const tiles: Tile[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        tiles.push(makeTile(values[r][c], r, c));
      }
    }
    expect(canMove(tiles)).toBe(true);
  });
});

describe('createTile', () => {
  it('creates a tile with the given value and position', () => {
    const counter = { current: 0 };
    const tile = createTile(4, 2, 3, counter);
    expect(tile.value).toBe(4);
    expect(tile.row).toBe(2);
    expect(tile.col).toBe(3);
    expect(tile.isNew).toBe(true);
    expect(tile.isMerged).toBe(false);
  });

  it('increments id counter', () => {
    const counter = { current: 5 };
    const tile = createTile(2, 0, 0, counter);
    expect(tile.id).toBe(6);
    expect(counter.current).toBe(6);
  });
});
