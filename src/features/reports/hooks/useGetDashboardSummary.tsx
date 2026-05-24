import { useQuery } from '@tanstack/react-query';
import { DashboardSummaryParams } from '../report-schema';
import { getDashboardSummary } from '../reports-api';

export const useGetDashboardSummary = (params: DashboardSummaryParams) => {
  return useQuery({
    queryKey: ['dashboardSummary', params],

    queryFn: async () => {
      const resp = await getDashboardSummary(params);

      if (!resp?.success) {
        throw new Error(resp?.message);
      }

      return resp.data;
    },
    enabled: !!params.year,
  });
};
