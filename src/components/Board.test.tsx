import { render, screen } from '@testing-library/react';
import Board from './Board';
import type { Tile } from '../types/game';

const makeTile = (id: number, value: number, row: number, col: number): Tile => ({
  id,
  value,
  row,
  col,
  isNew: false,
  isMerged: false,
});

describe('Board', () => {
  it('renders 16 empty cells', () => {
    const { container } = render(<Board tiles={[]} cellSize={100} gap={12} />);
    const cells = container.querySelectorAll('.board-cell');
    expect(cells).toHaveLength(16);
  });

  it('renders all tiles', () => {
    const tiles = [makeTile(1, 2, 0, 0), makeTile(2, 4, 1, 2)];
    render(<Board tiles={tiles} cellSize={100} gap={12} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('sets correct board dimensions based on cellSize and gap', () => {
    const { container } = render(<Board tiles={[]} cellSize={100} gap={12} />);
    const board = container.querySelector('.board') as HTMLElement;
    // 4*100 + 5*12 = 460
    expect(board.style.width).toBe('460px');
    expect(board.style.height).toBe('460px');
  });

  it('sets correct board dimensions for mobile (72px cells)', () => {
    const { container } = render(<Board tiles={[]} cellSize={72} gap={8} />);
    const board = container.querySelector('.board') as HTMLElement;
    // 4*72 + 5*8 = 328
    expect(board.style.width).toBe('328px');
    expect(board.style.height).toBe('328px');
  });

  it('renders no tiles when tiles array is empty', () => {
    const { container } = render(<Board tiles={[]} cellSize={100} gap={12} />);
    expect(container.querySelectorAll('.tile')).toHaveLength(0);
  });
});
