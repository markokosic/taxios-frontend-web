import { GetRevenueReportGroupBy, GetRevenueReportParams } from '@/api/generated/model';
import { RevenueReportParams } from '../domain/reports-schemas';

export const mapRevenueReportParamsToApiParams = (
  params: RevenueReportParams
): GetRevenueReportParams => {
  return {
    dateFrom: params.dateFrom || '',
    dateTo: params.dateTo || '',
    driverId: params.driverId ? parseInt(params.driverId, 10) : undefined,
    groupBy: (params.groupBy || undefined) as GetRevenueReportGroupBy,
  };
};
