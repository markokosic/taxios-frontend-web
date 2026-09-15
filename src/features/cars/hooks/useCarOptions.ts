import { useGetCarsForSelect } from '@/api/generated/endpoints/cars/cars';
import { CarSummary } from '@/api/generated/model';
import { mapCarsToOptions } from '../utils/car-options.utils';

export const useCarSelectOptions = () => {
  const {
    data: cars = [],
    isLoading,
    error,
  } = useGetCarsForSelect<CarSummary[]>({
    query: {
      select: (response) => response.data ?? [],
    },
  });

  const carOptions = mapCarsToOptions(cars);

  return {
    carOptions,
    cars,
    isLoading,
    error,
  };
};
