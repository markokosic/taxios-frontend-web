import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { LoginForm } from '../LoginForm';

describe('LoginForm Component', () => {
  it('renders email and password inputs and submit button', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<LoginForm />, { wrapper: Wrapper });

    expect(screen.getByLabelText(/form.email.label/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/form.password.label/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auth.login.submit/i })).toBeInTheDocument();
  });


  it('allows user to type into email and password inputs', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createTestAppWrapper();

    render(<LoginForm />, { wrapper: Wrapper });

    const emailInput = screen.getByLabelText(/form.email.label/i);
    const passwordInput = screen.getByLabelText(/form.password.label/i);

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'secret123');

    expect(emailInput).toHaveValue('user@example.com');
    expect(passwordInput).toHaveValue('secret123');
  });
});
