import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getCar } from '../cars-api';
import { Car, CarId } from '../cars-types';

type UseGetCarOptions = Omit<
  UseQueryOptions<Car, Error>,
  'queryKey' | 'queryFn'
>;

export function useGetCar(carId: CarId, options: UseGetCarOptions = {}) {
  return useQuery<Car, Error>({
    queryKey: ['cars', carId],
    queryFn: async () => {
      const resp = await getCar({ carId });
      if (!resp.success) {
        throw new Error(resp.message);
      }
      return resp.data;
    },
    ...options,
  });
}
