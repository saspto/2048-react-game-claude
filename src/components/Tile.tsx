import type { Tile as TileType } from '../types/game';

const tileColors: Record<number, { bg: string; text: string }> = {
  2: { bg: '#eee4da', text: '#776e65' },
  4: { bg: '#ede0c8', text: '#776e65' },
  8: { bg: '#f2b179', text: '#f9f6f2' },
  16: { bg: '#f59563', text: '#f9f6f2' },
  32: { bg: '#f67c5f', text: '#f9f6f2' },
  64: { bg: '#f65e3b', text: '#f9f6f2' },
  128: { bg: '#edcf72', text: '#f9f6f2' },
  256: { bg: '#edcc61', text: '#f9f6f2' },
  512: { bg: '#edc850', text: '#f9f6f2' },
  1024: { bg: '#edc53f', text: '#f9f6f2' },
  2048: { bg: '#edc22e', text: '#f9f6f2' },
};

const getFontSize = (value: number): string => {
  if (value >= 1024) return '1.4rem';
  if (value >= 128) return '1.8rem';
  return '2.2rem';
};

interface TileProps {
  tile: TileType;
  cellSize: number;
  gap: number;
}

const Tile = ({ tile, cellSize, gap }: TileProps) => {
  const colors = tileColors[tile.value] ?? { bg: '#3c3a32', text: '#f9f6f2' };
  const x = tile.col * (cellSize + gap);
  const y = tile.row * (cellSize + gap);

  return (
    <div
      className={`tile${tile.isNew ? ' tile-new' : ''}${tile.isMerged ? ' tile-merged' : ''}`}
      style={{
        width: cellSize,
        height: cellSize,
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: getFontSize(tile.value),
        left: x,
        top: y,
      }}
    >
      {tile.value}
    </div>
  );
};

export default Tile;
