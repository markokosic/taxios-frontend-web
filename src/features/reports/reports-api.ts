import { ApiResponse } from '@/common/types/api-types';
import { api } from '@/lib/apiClient';
import { RevenueReportParams, RevenueReportData } from './report-schema';

export const getRevenueReport = async (
  params: RevenueReportParams
): Promise<ApiResponse<RevenueReportData>> => {
  const apiParams = {
    ...params,
    driverId: params.driverId ? parseInt(params.driverId, 10) : undefined,
  };

  return await api.get('/reports/revenue', {
    params: apiParams,
  });
};
