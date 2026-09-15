import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mantine/core';
import { Form } from '@/shared/components/forms/Form';
import { useCarCreateForm } from '../hooks/useCarCreateForm';
import { CarForm } from './CarForm';

export const CarCreateForm = () => {
  const { t } = useTranslation(['app', 'common']);
  const { methods, onSubmit, isPending, cancel } = useCarCreateForm();

  return (
    <Box>
      <Form
        methods={methods}
        onSubmit={onSubmit}
        formActions={
          <>
            <Button
              variant="outline"
              onClick={cancel}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!methods.formState.isDirty || isPending}
            >
              {t('app:cars.actions.add_car')}
            </Button>
          </>
        }
      >
        <CarForm />
      </Form>
    </Box>
  );
};
