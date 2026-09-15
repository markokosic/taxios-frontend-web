import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShiftResponse } from '@/api/generated/model';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { DriverShiftCard } from '../driver/DriverShiftCard';

const mockShift: ShiftResponse = {
  id: 15,
  car: { id: 2, brand: 'Toyota', model: 'Prius', licensePlate: 'W-9988Z' },
  shiftStart: '2026-09-01T06:00:00Z',
  shiftEnd: '2026-09-01T14:00:00Z',
  odometerStart: 12000,
  odometerEnd: 12180,
  kilometersDriven: 180,
  status: 'PENDING',
  revenues: [
    {
      id: 1,
      entryCategory: 'REGULAR',
      revenue: 220,
    },
  ],
};

describe('DriverShiftCard Component', () => {
  it('renders driver shift details correctly', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<DriverShiftCard shift={mockShift} />, { wrapper: Wrapper });

    expect(screen.getByText('#15')).toBeInTheDocument();
    expect(screen.getByText(/W-9988Z/)).toBeInTheDocument();
    expect(screen.getByText(/Toyota Prius/)).toBeInTheDocument();
    expect(screen.getByText('180 km')).toBeInTheDocument();
    expect(screen.getByText(/220/)).toBeInTheDocument();
  });

  it('triggers onClick when clicked', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createTestAppWrapper();
    const handleClick = vi.fn();

    render(
      <DriverShiftCard
        shift={mockShift}
        onClick={handleClick}
      />,
      { wrapper: Wrapper }
    );

    await user.click(screen.getByText('#15'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
