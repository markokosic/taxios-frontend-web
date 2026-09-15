import { render, screen } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { AppLink } from '../AppLink';

describe('AppLink Component', () => {
  it('renders link with href attribute and children', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<AppLink to="/dashboard">Go to Dashboard</AppLink>, { wrapper: Wrapper });

    const linkElement = screen.getByRole('link', { name: /go to dashboard/i });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/dashboard');
  });
});
