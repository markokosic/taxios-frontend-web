import { render, screen } from '@testing-library/react';
import { UserResponse, UserResponseRoles } from '@/api/generated/model';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  const mockUser: UserResponse = {
    id: 1,
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    roles: UserResponseRoles.ADMIN,
    mustChangePassword: false,
  };

  it('renders user details, status, email, and role badge', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<UserCard user={mockUser} />, { wrapper: Wrapper });

    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('max@example.com')).toBeInTheDocument();
    expect(screen.getByText(/active|Aktiv/i)).toBeInTheDocument();
    expect(screen.getByText(/ADMIN|Administrator/i)).toBeInTheDocument();
  });

  it('renders pending password change status when mustChangePassword is true', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <UserCard
        user={{
          ...mockUser,
          mustChangePassword: true,
        }}
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(/pending_password_change|Passwortwechsel erforderlich/i)).toBeInTheDocument();
  });
});
