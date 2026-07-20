import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { RegisterForm } from '../RegisterForm';

describe('Register Form', () => {
  it('should render all form inputs, tenantName, email, password, firstName, lastName', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<RegisterForm />, { wrapper: Wrapper });

    const tenantName = screen.getByRole('textbox', { name: /tenant/i });
    const firstName = screen.getByRole('textbox', { name: /first/i });
    const lastName = screen.getByRole('textbox', { name: /last/i });
    const email = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/form.password.label/i);
    const confirmPasswordInput = screen.getByLabelText(/form.confirmPassword.label/i);

    expect(tenantName).toBeInTheDocument();
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
  });
});

it('should call handleSubmit fn', async () => {
  const user = userEvent.setup();
  const { Wrapper } = createTestAppWrapper();

  render(<RegisterForm />, { wrapper: Wrapper });

  const tenantName = screen.getByRole('textbox', { name: /tenant/i });
  const firstName = screen.getByRole('textbox', { name: /first/i });
  const lastName = screen.getByRole('textbox', { name: /last/i });
  const email = screen.getByRole('textbox', { name: /email/i });
  const password = screen.getByLabelText(/form.password.label/i);
  const confirmPassword = screen.getByLabelText(/form.confirmPassword.label/i);

  await user.type(tenantName, 'TestTenant');
  await user.type(firstName, 'John');
  await user.type(lastName, 'Doe');
  await user.type(email, 'john@example.com');
  await user.type(password, 'password123');
  await user.type(confirmPassword, 'password123');

  const submitButton = screen.getByRole('button', { name: /register/i });

  await user.click(submitButton);

  expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
});
