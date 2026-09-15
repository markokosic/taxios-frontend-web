import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { FloatingActionButton } from '../FloatingActionButton';

describe('FloatingActionButton Component', () => {
  it('renders button and responds to click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const { Wrapper } = createTestAppWrapper();

    render(
      <FloatingActionButton onClick={handleClick} aria-label="Add Item">
        <span>+</span>
      </FloatingActionButton>,
      { wrapper: Wrapper }
    );

    const button = screen.getByRole('button', { name: /add item/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
