import { render, screen } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { StatsCard } from '../StatsCard';

describe('StatsCard Component', () => {
  it('renders title and value correctly', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<StatsCard title="Gesamtumsatz" value="1.250,00 €" />, { wrapper: Wrapper });

    expect(screen.getByText('Gesamtumsatz')).toBeInTheDocument();
    expect(screen.getByText('1.250,00 €')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <StatsCard
        title="Gesamtumsatz"
        value="1.250,00 €"
        description="+5% zum Vormonat"
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('+5% zum Vormonat')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <StatsCard
        title="Gesamtumsatz"
        value="1.250,00 €"
        icon={<span data-testid="custom-icon">Icon</span>}
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
