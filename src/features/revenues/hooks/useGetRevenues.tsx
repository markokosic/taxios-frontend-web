import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getDailyRevenues } from '../revenues-api';
import { DailyRevenues } from '../revenues-schemas';

type UseGetRevenuesOptions = Omit<UseQueryOptions<DailyRevenues, Error>, 'queryKey' | 'queryFn'>;

export function useGetRevenues(
  page: number,
  size: number = 10,
  options: UseGetRevenuesOptions = {}
) {
  return useQuery<DailyRevenues, Error>({
    queryKey: ['revenues', { page, size }],
    queryFn: async () => {
      const resp = await getDailyRevenues(page, size);

      if (!resp.success) {
        throw new Error(resp.message);
      }

      return resp.data;
    },
    ...options,
  });
}
