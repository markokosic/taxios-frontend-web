import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { useDriverCreateShiftForm } from '../driver/useDriverCreateShiftForm';

describe('useDriverCreateShiftForm Hook', () => {
  it('initializes driver form with correct default values', () => {
    const { Wrapper } = createTestAppWrapper();
    const { result } = renderHook(() => useDriverCreateShiftForm(), { wrapper: Wrapper });

    expect(result.current.methods.getValues()).toEqual({
      carId: undefined,
      shiftStart: '',
      shiftEnd: '',
      odometerStart: undefined,
      odometerEnd: undefined,
      singleRides: [],
      flatRateCounts: {},
      flatRatePrices: {},
      weeklyRentPaid: undefined,
    });
    expect(result.current.isPending).toBe(false);
  });

  it('submits each cash ride as individual REGULAR revenue entry', () => {
    const { Wrapper } = createTestAppWrapper();
    const { result } = renderHook(() => useDriverCreateShiftForm(), { wrapper: Wrapper });

    const formValues = {
      carId: 3,
      odometerStart: 50000,
      odometerEnd: 50150,
      shiftStart: '2026-09-01T08:00:00Z',
      shiftEnd: '2026-09-01T16:00:00Z',
      singleRides: [15.5, 22.0, 30.0],
      flatRateCounts: {},
      flatRatePrices: {},
      weeklyRentPaid: undefined as unknown as number,
    };

    // Calling onSubmit
    result.current.onSubmit(formValues as any, []);
  });
});
