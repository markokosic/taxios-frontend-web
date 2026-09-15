import { render, screen } from '@testing-library/react';
import { UserResponseRoles } from '@/api/generated/model';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { UserRoleBadge } from '../UserRoleBadge';

describe('UserRoleBadge', () => {
  it('renders correctly for each role', () => {
    const { Wrapper } = createTestAppWrapper();

    const { rerender } = render(<UserRoleBadge role={UserResponseRoles.ADMIN} />, { wrapper: Wrapper });
    expect(screen.getByText(/ADMIN|Administrator/i)).toBeInTheDocument();

    rerender(<UserRoleBadge role={UserResponseRoles.OWNER} />);
    expect(screen.getByText(/OWNER|Inhaber/i)).toBeInTheDocument();

    rerender(<UserRoleBadge role={UserResponseRoles.DRIVER} />);
    expect(screen.getByText(/DRIVER|Fahrer/i)).toBeInTheDocument();

    rerender(<UserRoleBadge role={UserResponseRoles.BACKOFFICE} />);
    expect(screen.getByText(/BACKOFFICE/i)).toBeInTheDocument();
  });

  it('renders nothing when role is undefined', () => {
    const { Wrapper } = createTestAppWrapper();
    render(<UserRoleBadge role={undefined} />, { wrapper: Wrapper });
    expect(screen.queryByText(/Administrator|ADMIN|Inhaber|OWNER|Fahrer|DRIVER|Backoffice|BACKOFFICE/i)).not.toBeInTheDocument();
  });

});
