import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getGetAllShiftsQueryKey, useDeleteShift } from '@/api/generated/endpoints/shifts/shifts';
import { ShiftResponse } from '@/api/generated/model';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';

export const useDeleteShiftAction = (options?: { onSuccess?: () => void }) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const { confirm } = useConfirmModal();
  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useDeleteShift({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:shifts.notifications.delete.success'));
        queryClient.invalidateQueries({ queryKey: getGetAllShiftsQueryKey() });
        options?.onSuccess?.();
      },
      onError: (err: unknown) => {
        const apiErrorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('errors:common.unknown');
        toast.error(apiErrorMessage);
      },
    },
  });

  const handleDelete = (shift: ShiftResponse) => {
    if (!shift.id) {
      return;
    }
    confirm({
      title: t('app:shifts.modals.delete_confirm.title'),
      labels: {
        confirm: t('common:actions.delete'),
        cancel: t('common:actions.cancel'),
      },
      onConfirm: () => {
        deleteMutate({ id: shift.id! });
      },
    });
  };

  return { handleDelete };
};
