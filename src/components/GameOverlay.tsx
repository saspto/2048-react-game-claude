interface GameOverlayProps {
  status: 'won' | 'lost';
  onContinue?: () => void;
  onNewGame: () => void;
}

const GameOverlay = ({ status, onContinue, onNewGame }: GameOverlayProps) => (
  <div className="overlay">
    <div className="overlay-content">
      <h2 className="overlay-title">{status === 'won' ? 'You Win!' : 'Game Over!'}</h2>
      {status === 'won' && onContinue && (
        <button className="btn btn-primary" onClick={onContinue}>
          Keep Going
        </button>
      )}
      <button className="btn btn-secondary" onClick={onNewGame}>
        New Game
      </button>
    </div>
  </div>
);

export default GameOverlay;
