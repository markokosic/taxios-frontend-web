import { useTranslation } from 'react-i18next';
import { Button, Modal, Stack } from '@mantine/core';
import { FlatRateTypeResponse } from '@/api/generated/model';
import { ControlledNumberInput } from '@/shared/components/forms/ControlledNumberInput';
import { ControlledTextInput } from '@/shared/components/forms/ControlledTextInput';
import { Form } from '@/shared/components/forms/Form';
import { useUpdateFlatRateForm } from '../hooks/useUpdateFlatRateForm';

interface EditFlatRateModalProps {
  flatRate: FlatRateTypeResponse | null;
  opened: boolean;
  onClose: () => void;
}

export const EditFlatRateModal = ({ flatRate, opened, onClose }: EditFlatRateModalProps) => {
  const { t } = useTranslation(['app', 'common']);
  const { methods, onSubmit, isPending } = useUpdateFlatRateForm({
    flatRate,
    onSuccess: onClose,
  });

  const formIsValid = methods.formState.isValid;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('app:flatrate.edit_title')}
      centered
      size="md"
    >
      <Form
        methods={methods}
        onSubmit={onSubmit}
        formActions={
          <>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!formIsValid || isPending}
            >
              {t('common:actions.save')}
            </Button>
          </>
        }
      >
        <Stack gap="md">
          <ControlledTextInput
            name="name"
            label={t('app:flatrate.name.label')}
            placeholder={t('app:flatrate.name.placeholder')}
            withAsterisk
          />
          <ControlledNumberInput
            name="defaultPrice"
            label={t('app:flatrate.default_price.label')}
            placeholder={t('app:flatrate.default_price.placeholder')}
            min={0}
            decimalScale={2}
            suffix=" €"
          />
        </Stack>
      </Form>
    </Modal>
  );
};
