import { useQuery } from '@tanstack/react-query';
import { RevenueReportParams } from '../report-schema';
import { getRevenueReport } from '../reports-api';

export const useGetRevenueReport = (params: RevenueReportParams) => {
  return useQuery({
    queryKey: ['revenueReport', params],

    queryFn: async () => {
      const resp = await getRevenueReport(params);

      if (!resp?.success) {
        throw new Error(resp?.message);
      }

      return resp.data;
    },
    //TODO disable if no correct params set
    enabled: !!params,
  });
};
