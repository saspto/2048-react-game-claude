export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
}

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  status: 'playing' | 'won' | 'lost' | 'continue';
}
