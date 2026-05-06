import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PaginatedList } from '@/common/types/api-types';
import { getCars } from '../cars-api';
import { Car } from '../cars-types';

type UseGetCarsOptions = Omit<
  UseQueryOptions<PaginatedList<Car[]>, Error>,
  'queryKey' | 'queryFn'
>;

export function useGetCars(options: UseGetCarsOptions = {}) {
  return useQuery<PaginatedList<Car[]>, Error>({
    queryKey: ['cars'],
    queryFn: async () => {
      const resp = await getCars();
      if (!resp.success) {
        throw new Error(resp.message);
      }
      return resp.data;
    },
    ...options,
  });
}
