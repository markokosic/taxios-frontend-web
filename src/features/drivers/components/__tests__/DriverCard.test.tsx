import { render, screen } from '@testing-library/react';
import { DriverResponse, DriverResponseStatus } from '@/api/generated/model';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { DriverCard } from '../DriverCard';

const mockDriverWithUser: DriverResponse = {
  id: 1,
  userId: 42,
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max@example.com',
  phone: '+43 660 1234567',
  status: DriverResponseStatus.ACTIVE,
  currentRemunerationConfigs: [],
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
};

const mockDriverWithoutUser: DriverResponse = {
  ...mockDriverWithUser,
  userId: undefined,
};

describe('DriverCard', () => {
  it('renders driver details and user access badge when userId is present', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<DriverCard driver={mockDriverWithUser} />, { wrapper: Wrapper });

    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('max@example.com')).toBeInTheDocument();
    expect(screen.getByText(/active|aktiv/i)).toBeInTheDocument();
    expect(screen.getByText(/has_user|app-zugang aktiv/i)).toBeInTheDocument();
  });

  it('does not render user access badge when userId is not present', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<DriverCard driver={mockDriverWithoutUser} />, { wrapper: Wrapper });

    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.queryByText(/has_user|app-zugang aktiv/i)).not.toBeInTheDocument();
  });
});
