import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { usePagination } from '../usePagination';

const createWrapper = (initialEntry = '/') => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
  );
};

describe('usePagination', () => {
  it('should return default page 1 and size 10 when no query params are present', () => {
    const { result } = renderHook(() => usePagination(), { wrapper: createWrapper() });

    expect(result.current.page).toBe(1);
    expect(result.current.size).toBe(10);
    expect(result.current.pageable).toEqual({ page: 1, size: 10 });
  });

  it('should parse page number from URL search parameters', () => {
    const { result } = renderHook(() => usePagination(), {
      wrapper: createWrapper('/?page=3'),
    });

    expect(result.current.page).toBe(3);
    expect(result.current.pageable).toEqual({ page: 3, size: 10 });
  });

  it('should fallback to page 1 for invalid or negative page parameters', () => {
    const { result } = renderHook(() => usePagination(), {
      wrapper: createWrapper('/?page=abc'),
    });

    expect(result.current.page).toBe(1);
  });

  it('should support custom default size option', () => {
    const { result } = renderHook(() => usePagination({ defaultSize: 20 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.size).toBe(20);
    expect(result.current.pageable).toEqual({ page: 1, size: 20 });
  });

  it('should update page when setPage is called', () => {
    const { result } = renderHook(() => usePagination(), { wrapper: createWrapper() });

    act(() => {
      result.current.setPage(4);
    });

    expect(result.current.page).toBe(4);
  });
});
