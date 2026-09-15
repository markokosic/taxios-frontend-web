import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { useUrlFilters } from '../useUrlFilters';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
);

describe('useUrlFilters', () => {
  it('should get default filter value when parameter is not present', () => {
    const { result } = renderHook(() => useUrlFilters(), { wrapper });
    expect(result.current.getFilter('nonExistingKey', 'defaultVal')).toBe('defaultVal');
  });

  it('should set filter parameter and reset page to 1', () => {
    const { result } = renderHook(() => useUrlFilters(), { wrapper });

    act(() => {
      result.current.setFilter('driverId', '42');
    });

    expect(result.current.getFilter('driverId')).toBe('42');
    expect(result.current.getFilter('page')).toBe('1');
  });

  it('should remove filter parameter when value is empty or null', () => {
    const { result } = renderHook(() => useUrlFilters(), { wrapper });

    act(() => {
      result.current.setFilter('driverId', '42');
    });
    expect(result.current.getFilter('driverId')).toBe('42');

    act(() => {
      result.current.setFilter('driverId', null);
    });
    expect(result.current.getFilter('driverId')).toBe('');
  });

  it('should clear specified filters', () => {
    const { result } = renderHook(() => useUrlFilters(), { wrapper });

    act(() => {
      result.current.setFilters({ driverId: '5', dateFrom: '2026-01-01' });
    });
    expect(result.current.getFilter('driverId')).toBe('5');
    expect(result.current.getFilter('dateFrom')).toBe('2026-01-01');

    act(() => {
      result.current.clearFilters(['driverId', 'dateFrom']);
    });
    expect(result.current.getFilter('driverId')).toBe('');
    expect(result.current.getFilter('dateFrom')).toBe('');
    expect(result.current.getFilter('page')).toBe('1');
  });

  it('should update page number', () => {
    const { result } = renderHook(() => useUrlFilters(), { wrapper });

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.getFilter('page')).toBe('3');
  });
});
