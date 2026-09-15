import dayjs from 'dayjs';
import { RevenueReportParams } from '../domain/reports-schemas';

export const parseReportFilters = (
  getFilter: (key: string) => string | null
): RevenueReportParams => {
  const dateFrom = getFilter('dateFrom') || dayjs().startOf('month').format('YYYY-MM-DD');
  const dateTo = getFilter('dateTo') || dayjs().endOf('month').format('YYYY-MM-DD');
  const driverId = getFilter('driverId') || null;
  const groupBy = (getFilter('groupBy') || 'DAY') as RevenueReportParams['groupBy'];

  return {
    dateFrom,
    dateTo,
    driverId,
    groupBy,
  };
};
