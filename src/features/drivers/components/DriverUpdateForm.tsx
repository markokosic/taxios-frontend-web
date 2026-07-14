import { useTranslation } from 'react-i18next';
import { Form } from '@/components/ui/Form';
import { Box, Button } from '@mantine/core';
import { useDriverUpdateForm } from '../hooks/useDriverUpdateForm';
import { DriverForm } from './DriverForm';
import { DriverResponse } from '@/api/generated/model';

interface DriverUpdateFormProps {
  driver: DriverResponse;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const DriverUpdateForm = ({ driver, onCancel, onSuccess }: DriverUpdateFormProps) => {
  const { t } = useTranslation(['app', 'common', 'errors']);
  const { methods, onSubmit, isPending } = useDriverUpdateForm({ driver, onCancel, onSuccess });

  return (
    <Box>
      <Form
        methods={methods}
        onSubmit={onSubmit}
        formActions={
          <>
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
              >
                {t('common:actions.cancel')}
              </Button>
            )}
            <Button
              type="submit"
              loading={isPending}
              disabled={!methods.formState.isDirty || isPending}
            >
              {t('common:actions.save')}
            </Button>
          </>
        }
      >
        <DriverForm />
      </Form>
    </Box>
  );
};
