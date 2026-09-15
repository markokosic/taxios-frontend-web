import dayjs from 'dayjs';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';

export interface ParsedShiftFilters {
  driverId: number | undefined;
  dateFrom: string | undefined;
  dateTo: string | undefined;
}

export const useShiftFilters = (): ParsedShiftFilters => {
  const { getFilter } = useUrlFilters();
  const driverIdStr = getFilter('driverId');
  const driverId = driverIdStr ? Number(driverIdStr) : undefined;
  const dateFromStr = getFilter('dateFrom');
  const dateToStr = getFilter('dateTo');

  const dateFrom = dateFromStr
    ? dayjs(dateFromStr).startOf('day').format('YYYY-MM-DDTHH:mm:ss')
    : undefined;

  const dateTo = dateToStr
    ? dayjs(dateToStr).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    : undefined;

  return {
    driverId,
    dateFrom,
    dateTo,
  };
};
