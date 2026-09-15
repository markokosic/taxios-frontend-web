import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { ShiftFilters } from '../admin/ShiftFilters';

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('ShiftFilters Component', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  it('renders driver filter and date inputs', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<ShiftFilters />, { wrapper: Wrapper });

    expect(screen.getByRole('combobox', { name: /fahrer|driver/i })).toBeInTheDocument();
  });
});
