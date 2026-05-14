import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRevenuesBulk } from '../revenues-api';
import { CreateRevenueRecordRequest } from '../revenues-schemas';

export function useCreateRevenuesBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRevenueRecordRequest[]) => {
      const resp = await createRevenuesBulk(payload);
      if (!resp.success) {
        throw new Error(resp.message);
      }
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
    },
  });
}
