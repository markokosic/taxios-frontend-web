import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCar } from '../cars-api';
import { CarId, UpdateCarRequest } from '../cars-types';

export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      carId,
      payload,
    }: {
      carId: CarId;
      payload: UpdateCarRequest;
    }) => {
      const resp = await updateCar({ carId, payload });
      if (!resp.success) {
        throw new Error(resp.message);
      }
      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars', data.id] });
    },
  });
}
