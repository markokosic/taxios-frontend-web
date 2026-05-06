import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCar } from '../cars-api';
import { CreateCarRequest } from '../cars-types';

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCarRequest) => {
      const resp = await createCar({ payload });
      if (!resp.success) {
        throw new Error(resp.message);
      }
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}
