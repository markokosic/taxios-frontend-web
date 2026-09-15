import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DriverResponse, DriverResponseStatus } from '@/api/generated/model';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { CreateDriverUserModal } from '../CreateDriverUserModal';

const mockDriver: DriverResponse = {
  id: 10,
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max@example.com',
  phone: '+43 660 1234567',
  status: DriverResponseStatus.ACTIVE,
  currentRemunerationConfigs: [],
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
};

describe('CreateDriverUserModal', () => {
  it('renders modal when opened with driver email prefilled', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <CreateDriverUserModal
        driver={mockDriver}
        opened
        onClose={vi.fn()}
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByDisplayValue('max@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit_button|zugang erstellen|create access/i })).toBeInTheDocument();
  });

  it('allows editing email in input field', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createTestAppWrapper();

    render(
      <CreateDriverUserModal
        driver={mockDriver}
        opened
        onClose={vi.fn()}
      />,
      { wrapper: Wrapper }
    );

    const input = screen.getByDisplayValue('max@example.com');
    await user.clear(input);
    await user.type(input, 'newdriver@example.com');
    expect(screen.getByDisplayValue('newdriver@example.com')).toBeInTheDocument();
  });
});
