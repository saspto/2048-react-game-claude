import { render, screen, fireEvent } from '@testing-library/react';
import GameOverlay from './GameOverlay';

describe('GameOverlay - won', () => {
  it('shows You Win! when status is won', () => {
    render(<GameOverlay status="won" onNewGame={() => {}} />);
    expect(screen.getByText('You Win!')).toBeInTheDocument();
  });

  it('shows Keep Going button when onContinue provided', () => {
    render(<GameOverlay status="won" onContinue={() => {}} onNewGame={() => {}} />);
    expect(screen.getByText('Keep Going')).toBeInTheDocument();
  });

  it('calls onContinue when Keep Going clicked', () => {
    const onContinue = jest.fn();
    render(<GameOverlay status="won" onContinue={onContinue} onNewGame={() => {}} />);
    fireEvent.click(screen.getByText('Keep Going'));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('does not show Keep Going when onContinue not provided', () => {
    render(<GameOverlay status="won" onNewGame={() => {}} />);
    expect(screen.queryByText('Keep Going')).not.toBeInTheDocument();
  });
});

describe('GameOverlay - lost', () => {
  it('shows Game Over! when status is lost', () => {
    render(<GameOverlay status="lost" onNewGame={() => {}} />);
    expect(screen.getByText('Game Over!')).toBeInTheDocument();
  });

  it('does not show Keep Going for lost status', () => {
    render(<GameOverlay status="lost" onNewGame={() => {}} />);
    expect(screen.queryByText('Keep Going')).not.toBeInTheDocument();
  });
});

describe('GameOverlay - New Game button', () => {
  it('shows New Game button', () => {
    render(<GameOverlay status="lost" onNewGame={() => {}} />);
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  it('calls onNewGame when New Game clicked', () => {
    const onNewGame = jest.fn();
    render(<GameOverlay status="lost" onNewGame={onNewGame} />);
    fireEvent.click(screen.getByText('New Game'));
    expect(onNewGame).toHaveBeenCalledTimes(1);
  });
});
