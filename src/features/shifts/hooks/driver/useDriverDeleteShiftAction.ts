import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  getGetMyShiftsInfiniteQueryKey,
  getGetMyShiftsQueryKey,
  useDeleteMyShift,
} from '@/api/generated/endpoints/shifts/shifts';
import { ShiftResponse } from '@/api/generated/model';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';

export const useDriverDeleteShiftAction = (options?: { onSuccess?: () => void }) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const { confirm } = useConfirmModal();
  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isPending } = useDeleteMyShift({
    mutation: {
      onSuccess: () => {
        toast.success(
          t('app:shifts.notifications.delete.success', 'Schicht erfolgreich gelöscht')
        );
        queryClient.invalidateQueries({ queryKey: getGetMyShiftsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyShiftsInfiniteQueryKey() });
        options?.onSuccess?.();
      },
      onError: (err: unknown) => {
        const apiErrorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('errors:common.unknown', 'Ein Fehler ist aufgetreten');
        toast.error(apiErrorMessage);
      },
    },
  });

  const handleDelete = (shift: ShiftResponse) => {
    if (!shift.id) {
      return;
    }

    if (shift.status !== 'PENDING') {
      toast.error(
        t(
          'app:shifts.errors.only_pending_can_be_deleted',
          'Nur ausstehende Schichten können gelöscht werden'
        )
      );
      return;
    }

    confirm({
      title: t('app:shifts.modals.delete_confirm.title', 'Schicht löschen?'),
      labels: {
        confirm: t('common:actions.delete', 'Löschen'),
        cancel: t('common:actions.cancel', 'Abbrechen'),
      },
      onConfirm: () => {
        deleteMutate({ id: shift.id! });
      },
    });
  };

  return { handleDelete, isPending };
};
