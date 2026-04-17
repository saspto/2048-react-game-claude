import type { Tile as TileType } from '../types/game';
import Tile from './Tile';

const GRID_SIZE = 4;

interface BoardProps {
  tiles: TileType[];
  cellSize: number;
  gap: number;
}

const Board = ({ tiles, cellSize, gap }: BoardProps) => {
  const boardSize = GRID_SIZE * cellSize + (GRID_SIZE + 1) * gap;
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

  return (
    <div className="board" style={{ width: boardSize, height: boardSize }}>
      <div className="board-grid">
        {cells.map((i) => (
          <div key={i} className="board-cell" style={{ width: cellSize, height: cellSize }} />
        ))}
      </div>
      <div className="tiles-container" style={{ width: boardSize, height: boardSize }}>
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} cellSize={cellSize} gap={gap} />
        ))}
      </div>
    </div>
  );
};

export default Board;
