import { render, screen } from '@testing-library/react';
import Score from './Score';

describe('Score', () => {
  it('renders current score', () => {
    render(<Score score={42} bestScore={100} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders best score', () => {
    render(<Score score={0} bestScore={999} />);
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('renders SCORE and BEST labels', () => {
    render(<Score score={0} bestScore={0} />);
    expect(screen.getByText('SCORE')).toBeInTheDocument();
    expect(screen.getByText('BEST')).toBeInTheDocument();
  });

  it('displays score 0 initially', () => {
    render(<Score score={0} bestScore={0} />);
    expect(screen.getAllByText('0')).toHaveLength(2);
  });
});
