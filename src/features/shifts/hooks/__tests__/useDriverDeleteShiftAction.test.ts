import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import toast from 'react-hot-toast';
import { ShiftResponse } from '@/api/generated/model';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { useDriverDeleteShiftAction } from '../driver/useDriverDeleteShiftAction';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useDriverDeleteShiftAction Hook', () => {
  it('blocks deletion if shift is not PENDING', () => {
    const { Wrapper } = createTestAppWrapper();
    const { result } = renderHook(() => useDriverDeleteShiftAction(), { wrapper: Wrapper });

    const approvedShift: ShiftResponse = {
      id: 99,
      status: 'APPROVED',
    };

    result.current.handleDelete(approvedShift);
    expect(toast.error).toHaveBeenCalled();
  });
});
