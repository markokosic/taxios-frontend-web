import { ReactNode } from 'react';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

export interface ConfirmModalOptions {
  title?: string;
  children?: ReactNode;
  labels?: {
    confirm?: string;
    cancel?: string;
  };
  confirmProps?: {
    color?: string;
  };
  onConfirm: () => void;
  onCancel?: () => void;
}

export const useConfirmModal = () => {
  const { t } = useTranslation(['common']);

  const confirm = ({
    title = t('common:actions.delete', 'Delete'),
    children,
    labels,
    confirmProps = { color: 'red' },
    onConfirm,
    onCancel,
  }: ConfirmModalOptions) => {
    return modals.openConfirmModal({
      title,
      centered: true,
      labels: {
        confirm: labels?.confirm || t('common:actions.yes', 'Yes, delete'),
        cancel: labels?.cancel || t('common:actions.cancel', 'Cancel'),
      },
      confirmProps,
      children,
      onConfirm,
      onCancel,
    });
  };

  return { confirm };
};
