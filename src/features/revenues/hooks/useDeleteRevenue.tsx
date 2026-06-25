import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDailyRevenue } from '../revenues-api';

export function useDeleteRevenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const resp = await deleteDailyRevenue(id);

      if (!resp.success) {
        throw new Error(resp.message || 'Fehler beim Löschen des Umsatzes');
      }

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
    },
  });
}
