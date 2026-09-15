import { useGetDashboardReport } from '@/api/generated/endpoints/reports/reports';
import { DashboardSummaryData, DashboardSummaryParams } from '../domain/reports-schemas';

export const useGetDashboardSummary = (params: DashboardSummaryParams) => {
  return useGetDashboardReport<DashboardSummaryData>(params, {
    query: {
      select: (response) => response.data as DashboardSummaryData,
      enabled: !!params?.year,
    },
  });
};
