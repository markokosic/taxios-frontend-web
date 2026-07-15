import { useTranslation } from 'react-i18next';
import { Form } from '@/components/ui/Form';
import { Box, Button } from '@mantine/core';
import { CarForm } from './CarForm';
import { useCarUpdateForm } from '../hooks/useCarUpdateForm';
import { CarResponse } from '@/api/generated/model';

export const CarUpdateForm = ({ car }: { car: CarResponse }) => {
  const { t } = useTranslation(['common']);
  const { methods, onSubmit, isPending } = useCarUpdateForm(car);

  return (
    <Box>
      <Form
        methods={methods}
        onSubmit={onSubmit}
        formActions={
          <Button
            type="submit"
            loading={isPending}
            disabled={!methods.formState.isDirty || isPending}
          >
            {t('actions.save')}
          </Button>
        }
      >
        <CarForm />
      </Form>
    </Box>
  );
};
