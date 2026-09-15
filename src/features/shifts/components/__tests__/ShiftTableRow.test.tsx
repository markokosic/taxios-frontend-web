import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from '@mantine/core';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { ShiftTableRow } from '../admin/ShiftTableRow';

describe('ShiftTableRow Component', () => {
  const mockShift = {
    id: 10,
    driver: { id: 1, firstName: 'Max', lastName: 'Mustermann' },
    car: { id: 2, licensePlate: 'W-12345X' },
    shiftStart: '2026-08-13T06:00:00Z',
    shiftEnd: '2026-08-13T14:30:00Z',
    odometerStart: 45000,
    odometerEnd: 45300,
    kilometersDriven: 300,
    status: 'APPROVED' as const,
    revenues: [
      {
        id: 1,
        entryCategory: 'REGULAR' as const,
        revenue: 150,
        driverRemuneration: 75,
        companyRemuneration: 75,
      },
    ],
  };

  it('renders shift row details correctly', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <Table>
        <Table.Tbody>
          <ShiftTableRow
            shift={mockShift}
            actions={{
              onViewDetails: vi.fn(),
              onDelete: vi.fn(),
            }}
          />
        </Table.Tbody>
      </Table>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('#10')).toBeInTheDocument();
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('W-12345X')).toBeInTheDocument();
    expect(screen.getByText('300 km')).toBeInTheDocument();
    expect(screen.getByText(/150/)).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();
  });

  it('calls onViewDetails when row is clicked', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createTestAppWrapper();
    const handleView = vi.fn();
    const handleDelete = vi.fn();

    render(
      <Table>
        <Table.Tbody>
          <ShiftTableRow
            shift={mockShift}
            actions={{
              onViewDetails: handleView,
              onDelete: handleDelete,
            }}
          />
        </Table.Tbody>
      </Table>,
      { wrapper: Wrapper }
    );

    await user.click(screen.getByText('Max Mustermann'));
    expect(handleView).toHaveBeenCalledWith(mockShift);
  });
});
