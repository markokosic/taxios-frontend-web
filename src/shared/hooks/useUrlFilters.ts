import { useSearchParams } from 'react-router';

export const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilter = (key: string, defaultValue: string = ''): string => {
    return searchParams.get(key) || defaultValue;
  };

  const setFilter = (
    key: string,
    value: string | number | boolean | null | undefined
  ) => {
    setSearchParams((prev) => {
      if (value !== null && value !== undefined && value !== '') {
        prev.set(key, String(value));
      } else {
        prev.delete(key);
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const setFilters = (filters: Record<string, string | null | undefined>) => {
    setSearchParams((prev) => {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          prev.set(key, value);
        } else {
          prev.delete(key);
        }
      });
      prev.set('page', '1');
      return prev;
    });
  };

  const clearFilters = (keys: string[]) => {
    setSearchParams((prev) => {
      keys.forEach((key) => prev.delete(key));
      prev.set('page', '1');
      return prev;
    });
  };

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  return {
    searchParams,
    getFilter,
    setFilter,
    setFilters,
    clearFilters,
    setPage,
  };
};
