import { useGetDashboardReport } from '@/api/generated/endpoints/reports/reports';
import { DashboardSummaryData, DashboardSummaryParams } from '../report-schema';

export const useGetDashboardSummary = (params: DashboardSummaryParams) => {
  return useGetDashboardReport<DashboardSummaryData>(params, {
    query: {
      select: (response) => response.data as any,
      enabled: !!params?.year,
    },
  });
};
