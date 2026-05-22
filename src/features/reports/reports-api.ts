import { ApiResponse } from '@/common/types/api-types';
import { api } from '@/lib/apiClient';
import { RevenueReportParams } from './report-schema';

export const getRevenueReport = async (
  params: RevenueReportParams
): Promise<ApiResponse<any>> => {
  return await api.get('/reports/revenue', {
    params,
  });
};
