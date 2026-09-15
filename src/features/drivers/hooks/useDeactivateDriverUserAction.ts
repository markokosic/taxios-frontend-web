import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  getGetAllDriversQueryKey,
  getGetDriverQueryKey,
  useDeactivateDriverUser,
} from '@/api/generated/endpoints/drivers/drivers';
import { getGetAllUsersQueryKey } from '@/api/generated/endpoints/users/users';
import { DriverResponse } from '@/api/generated/model';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';

export const useDeactivateDriverUserAction = (options?: { onSuccess?: () => void }) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const { confirm } = useConfirmModal();
  const queryClient = useQueryClient();

  const { mutate: deactivateUser, isPending } = useDeactivateDriverUser({
    mutation: {
      onSuccess: (_data, variables) => {
        toast.success(t('app:drivers.notifications.deactivate_user.success'));
        queryClient.invalidateQueries({ queryKey: getGetDriverQueryKey(variables.id) });
        queryClient.invalidateQueries({ queryKey: getGetAllDriversQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
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

  const handleDeactivate = (driver: DriverResponse) => {
    if (!driver.id) {
      return;
    }
    confirm({
      title: t('app:drivers.modals.deactivate_user_confirm.title'),
      children: t('app:drivers.modals.deactivate_user_confirm.message'),
      labels: {
        confirm: t('app:drivers.actions.deactivate_access'),
        cancel: t('common:actions.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deactivateUser({ id: driver.id });
      },
    });
  };

  return { handleDeactivate, isDeactivating: isPending };
};
