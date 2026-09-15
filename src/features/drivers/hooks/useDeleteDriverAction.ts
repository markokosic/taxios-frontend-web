import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  getGetAllDriversQueryKey,
  useDeleteDriver,
} from '@/api/generated/endpoints/drivers/drivers';
import { DriverResponse } from '@/api/generated/model';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';

export const useDeleteDriverAction = (options?: { onSuccess?: () => void }) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const { confirm } = useConfirmModal();
  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useDeleteDriver({
    mutation: {
      onSuccess: () => {
        toast.success(t('app:drivers.notifications.delete.success'));
        queryClient.invalidateQueries({ queryKey: getGetAllDriversQueryKey() });
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

  const handleDelete = (driver: DriverResponse) => {
    if (!driver.id) {
      return;
    }
    confirm({
      title: t('app:drivers.modals.delete_confirm.title'),
      labels: {
        confirm: t('common:actions.delete'),
        cancel: t('common:actions.cancel'),
      },
      onConfirm: () => {
        deleteMutate({ id: driver.id });
      },
    });
  };

  return { handleDelete };
};
