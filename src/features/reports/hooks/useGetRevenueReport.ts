import { useGetRevenueReport as useGetRevenueReportGenerated } from '@/api/generated/endpoints/reports/reports';
import { RevenueReportData, RevenueReportParams } from '../domain/reports-schemas';
import { mapRevenueReportParamsToApiParams } from '../utils/report-params.utils';

export const useGetRevenueReport = (params: RevenueReportParams) => {
  const apiParams = mapRevenueReportParamsToApiParams(params);

  return useGetRevenueReportGenerated<RevenueReportData>(apiParams, {
    query: {
      select: (response) => response.data as RevenueReportData,
      enabled: !!params,
    },
  });
};
