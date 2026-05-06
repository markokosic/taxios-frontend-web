import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Form } from 'src/components/ui/Form';
import { Box, Button } from '@mantine/core';
import { getUpdateCarSchema } from '../cars-schemas';
import { Car, UpdateCarRequest } from '../cars-types';
import { useUpdateCar } from '../hooks/useUpdateCar';
import { CarForm } from './CarForm';

export const CarUpdateForm = ({ car }: { car: Car }) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useUpdateCar();

  const methods = useForm({
    resolver: zodResolver(getUpdateCarSchema(t)),
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: car,
  });

  const onSubmit = (data: UpdateCarRequest) => {
    mutate(
      { carId: car.id, payload: data },
      {
        onSuccess: () => {
          toast.success(t('cars:notifications.update.success'));
          methods.reset(data);
        },
      }
    );
  };

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
            {t('common:actions.save_changes')}
          </Button>
        }
      >
        <CarForm />
      </Form>
    </Box>
  );
};
