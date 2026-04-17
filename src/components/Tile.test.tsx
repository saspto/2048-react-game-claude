import { render, screen } from '@testing-library/react';
import Tile from './Tile';
import type { Tile as TileType } from '../types/game';

const makeTile = (overrides: Partial<TileType> = {}): TileType => ({
  id: 1,
  value: 2,
  row: 0,
  col: 0,
  isNew: false,
  isMerged: false,
  ...overrides,
});

describe('Tile', () => {
  it('renders tile value', () => {
    render(<Tile tile={makeTile({ value: 128 })} cellSize={100} gap={12} />);
    expect(screen.getByText('128')).toBeInTheDocument();
  });

  it('positions tile based on row/col', () => {
    const { container } = render(
      <Tile tile={makeTile({ row: 1, col: 2 })} cellSize={100} gap={12} />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.left).toBe('224px'); // col=2: 2*(100+12) = 224
    expect(el.style.top).toBe('112px');  // row=1: 1*(100+12) = 112
  });

  it('applies tile-new class when isNew', () => {
    const { container } = render(
      <Tile tile={makeTile({ isNew: true })} cellSize={100} gap={12} />,
    );
    expect(container.firstChild).toHaveClass('tile-new');
  });

  it('applies tile-merged class when isMerged', () => {
    const { container } = render(
      <Tile tile={makeTile({ isMerged: true })} cellSize={100} gap={12} />,
    );
    expect(container.firstChild).toHaveClass('tile-merged');
  });

  it('does not apply animation classes for a plain tile', () => {
    const { container } = render(
      <Tile tile={makeTile()} cellSize={100} gap={12} />,
    );
    expect(container.firstChild).not.toHaveClass('tile-new');
    expect(container.firstChild).not.toHaveClass('tile-merged');
  });

  it('uses dark fallback color for values above 2048', () => {
    const { container } = render(
      <Tile tile={makeTile({ value: 4096 })} cellSize={100} gap={12} />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe('rgb(60, 58, 50)'); // #3c3a32
  });

  it('uses smaller font for 4-digit values', () => {
    const { container } = render(
      <Tile tile={makeTile({ value: 1024 })} cellSize={100} gap={12} />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.fontSize).toBe('1.4rem');
  });
});
