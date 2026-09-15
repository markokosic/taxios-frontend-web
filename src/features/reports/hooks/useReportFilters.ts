import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import { parseReportFilters } from '../utils/report-filters.utils';

export const useReportFilters = () => {
  const { getFilter, setFilter, setFilters } = useUrlFilters();

  const filters = parseReportFilters(getFilter);

  return {
    filters,
    setFilter,
    setFilters,
  };
};
