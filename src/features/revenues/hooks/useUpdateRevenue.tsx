import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDailyRevenue } from '../revenues-api';
import { CreateRevenueRecordRequest } from '../revenues-schemas';

export function useUpdateRevenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateRevenueRecordRequest;
    }) => {
      const resp = await updateDailyRevenue(id, payload);
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
