import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mantine/core';
import { useCarCreateForm } from '@/features/cars/hooks/useCarCreateForm';
import { Form } from '@/components/ui/Form';
import { CarForm } from '@/features/cars/components/CarForm';


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
