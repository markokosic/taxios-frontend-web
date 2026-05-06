import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCar } from '../cars-api';
import { CarId } from '../cars-types';

export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carId: CarId) => {
      const resp = await deleteCar({ carId });
      if (!resp.success) {
        throw new Error(resp.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}
