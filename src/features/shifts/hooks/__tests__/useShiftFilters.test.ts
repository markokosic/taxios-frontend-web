import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useShiftFilters } from '../shared/useShiftFilters';

const mockGetFilter = vi.fn();

vi.mock('@/shared/hooks/useUrlFilters', () => ({
  useUrlFilters: () => ({
    getFilter: mockGetFilter,
  }),
}));

describe('useShiftFilters', () => {
  it('formats dateFrom and dateTo as ISO LocalDateTime format YYYY-MM-DDTHH:mm:ss', () => {
    mockGetFilter.mockImplementation((key: string) => {
      if (key === 'driverId') {
        return '5';
      }
      if (key === 'dateFrom') {
        return '2026-07-01';
      }
      if (key === 'dateTo') {
        return '2026-07-31';
      }
      return null;
    });

    const { result } = renderHook(() => useShiftFilters());

    expect(result.current).toEqual({
      driverId: 5,
      dateFrom: '2026-07-01T00:00:00',
      dateTo: '2026-07-31T23:59:59',
    });
  });

  it('returns undefined when no filters are set', () => {
    mockGetFilter.mockReturnValue(null);

    const { result } = renderHook(() => useShiftFilters());

    expect(result.current).toEqual({
      driverId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });
  });
});
