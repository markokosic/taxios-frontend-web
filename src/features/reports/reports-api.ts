import { ApiResponse } from '@/common/types/api-types';
import { api } from '@/lib/apiClient';
import {
  RevenueReportParams,
  RevenueReportData,
  DashboardSummaryParams,
  DashboardSummaryData,
} from './report-schema';

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

export const getDashboardSummary = async (
  params: DashboardSummaryParams
): Promise<ApiResponse<DashboardSummaryData>> => {
  return await api.get('/reports/dashboard', {
    params,
  });
};
