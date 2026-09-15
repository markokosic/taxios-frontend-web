import { useUrlFilters } from './useUrlFilters';

export interface PaginationOptions {
  defaultSize?: number;
}

export const usePagination = (options: PaginationOptions = {}) => {
  const { defaultSize = 10 } = options;
  const { getFilter, setPage } = useUrlFilters();

  const rawPage = Number(getFilter('page', '1'));
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  return {
    page,
    size: defaultSize,
    pageable: { page, size: defaultSize },
    setPage,
  };
};

