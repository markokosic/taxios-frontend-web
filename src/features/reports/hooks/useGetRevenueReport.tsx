import { useGetRevenueReport as useGetRevenueReportGenerated } from '@/api/generated/endpoints/reports/reports';
import { RevenueReportData, RevenueReportParams } from '../report-schema';

export const useGetRevenueReport = (params: RevenueReportParams) => {
  const apiParams = {
    dateFrom: params.dateFrom || '',
    dateTo: params.dateTo || '',
    driverId: params.driverId ? parseInt(params.driverId, 10) : undefined,
    groupBy: (params.groupBy || undefined) as any,
  };

  return useGetRevenueReportGenerated<RevenueReportData>(apiParams, {
    query: {
      select: (response) => response.data as any,
      enabled: !!params,
    },
  });
};
