import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ShiftResponse } from '@/api/generated/model';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { useDriverUpdateShiftForm } from '../driver/useDriverUpdateShiftForm';

const mockShift: ShiftResponse = {
  id: 12,
  car: { id: 3, licensePlate: 'W-456XY' },
  odometerStart: 50000,
  odometerEnd: 50150,
  shiftStart: '2026-09-01T08:00:00Z',
  shiftEnd: '2026-09-01T16:00:00Z',
  status: 'PENDING',
  weeklyDriverRent: 350,
  settlement: {
    companyRemuneration: 350,
  },
  revenues: [
    {
      id: 101,
      entryCategory: 'REGULAR',
      revenue: 120,
    },
    {
      id: 102,
      entryCategory: 'FLAT_RATE',
      flatRateTypeId: 5,
      tripCount: 3,
      pricePerTrip: 25,
    },
    {
      id: 103,
      entryCategory: 'WEEKLY',
      revenue: 350,
    },
  ],
};

describe('useDriverUpdateShiftForm Hook', () => {
  it('initializes edit form prefilled with shift values', () => {
    const { Wrapper } = createTestAppWrapper();
    const { result } = renderHook(() => useDriverUpdateShiftForm({ shift: mockShift }), {
      wrapper: Wrapper,
    });

    const values = result.current.methods.getValues();
    expect(values.carId).toBe(3);
    expect(values.odometerStart).toBe(50000);
    expect(values.odometerEnd).toBe(50150);
    expect(values.shiftStart).toBe('2026-09-01T08:00:00Z');
    expect(values.shiftEnd).toBe('2026-09-01T16:00:00Z');
    expect(values.singleRides).toEqual([120]);
    expect(values.flatRateCounts).toEqual({ '5': 3 });
    expect(values.flatRatePrices).toEqual({ '5': 25 });
    expect(values.weeklyRentPaid).toBe(350);
    expect(result.current.isPending).toBe(false);
  });

  it('submits clean revenues with only ID and amounts for existing and category for new entries', () => {
    const { Wrapper } = createTestAppWrapper();
    const { result } = renderHook(() => useDriverUpdateShiftForm({ shift: mockShift }), {
      wrapper: Wrapper,
    });

    const formValues = {
      carId: 3,
      odometerStart: 50000,
      odometerEnd: 50150,
      shiftStart: '2026-09-01T08:00:00Z',
      shiftEnd: '2026-09-01T16:00:00Z',
      singleRides: [120], // Existing (id: 101)
      flatRateCounts: {
        '5': 4, // Existing (id: 102)
        '9': 2, // New flat rate
      },
      flatRatePrices: {
        '5': 25,
        '9': 40,
      },
      weeklyRentPaid: 350, // Existing (id: 103)
    };

    const flatRateOptions = [
      { id: 5, name: 'Airport', defaultPrice: 25 },
      { id: 9, name: 'City Tour', defaultPrice: 40 },
    ];

    result.current.onSubmit(formValues, flatRateOptions as any);
  });
});
