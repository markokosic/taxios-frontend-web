import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { ShiftResponse } from '@/api/generated/model';
import { AdminEditShiftForm } from '../admin/AdminEditShiftForm';

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const mockShift: ShiftResponse = {
  id: 42,
  driver: { id: 1, firstName: 'Max', lastName: 'Mustermann' },
  car: { id: 2, brand: 'Toyota', model: 'Prius', licensePlate: 'W-1234AB' },
  odometerStart: 10000,
  odometerEnd: 10200,
  shiftStart: '2026-08-13T06:00:00Z',
  shiftEnd: '2026-08-13T14:00:00Z',
  status: 'APPROVED',
  settlement: {
    totalRevenue: 250,
    driverRemuneration: 125,
    companyRemuneration: 125,
  },
  revenues: [
    {
      id: 101,
      entryCategory: 'REGULAR',
      revenue: 250,
    },
  ],
};

describe('EditShiftForm Component', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  it('renders edit shift form with disabled driver and car fields and existing revenue row', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<AdminEditShiftForm shift={mockShift} />, { wrapper: Wrapper });

    // Check driver and car comboboxes exist and are disabled
    const driverInput = screen.getByRole('combobox', { name: /fahrer|driver/i });
    expect(driverInput).toBeDisabled();

    const carInput = screen.getByRole('combobox', { name: /fahrzeug|car/i });
    expect(carInput).toBeDisabled();

    // Check save and cancel buttons
    expect(screen.getByRole('button', { name: /speichern|save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abbrechen|cancel/i })).toBeInTheDocument();
  });

  it('handles shift with both FLAT_RATE and REGULAR revenues where REGULAR has null tripCount/pricePerTrip', () => {
    const { Wrapper } = createTestAppWrapper();

    const mixedShift: ShiftResponse = {
      ...mockShift,
      revenues: [
        {
          id: 225,
          entryCategory: 'FLAT_RATE',
          flatRateTypeId: 1,
          flatRateTypeName: 'City Taxi',
          revenue: 380,
          tripCount: 100,
          pricePerTrip: 3.8,
        },
        {
          id: 226,
          entryCategory: 'REGULAR',
          flatRateTypeId: undefined,
          revenue: 100,
          tripCount: undefined,
          pricePerTrip: undefined,
        },
      ],
      appliedRemunerationConfigs: [
        {
          id: 99,
          remunerationModelType: 'FLAT_RATE',
          flatRateTypeId: 1,
          flatRateTypeName: 'City Taxi',
          defaultPrice: 3.8,
          current: true,
        },
      ],
    };

    render(<AdminEditShiftForm shift={mixedShift} />, { wrapper: Wrapper });

    expect(screen.getByText(/City Taxi/i)).toBeInTheDocument();
  });
});
