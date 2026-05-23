import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getDriversNames } from '../drivers-api';
import { DriverSelect } from '../drivers-types';

type useGetCustomersOptions = Omit<UseQueryOptions<DriverSelect[], Error>, 'queryKey' | 'queryFn'>;

export function useGetDriversForSelect(options: useGetCustomersOptions = {}) {
  return useQuery<DriverSelect[], Error>({
    queryKey: ['driversSelect'],
    queryFn: async () => {
      const resp = await getDriversNames();
      if (!resp.success) {
        throw new Error(resp.message);
      }
      return resp.data;
    },
    ...options,
  });
}
