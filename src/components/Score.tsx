interface ScoreProps {
  score: number;
  bestScore: number;
}

const Score = ({ score, bestScore }: ScoreProps) => (
  <div className="scores">
    <div className="score-box">
      <span className="score-label">SCORE</span>
      <span className="score-value">{score}</span>
    </div>
    <div className="score-box">
      <span className="score-label">BEST</span>
      <span className="score-value">{bestScore}</span>
    </div>
  </div>
);

export default Score;
