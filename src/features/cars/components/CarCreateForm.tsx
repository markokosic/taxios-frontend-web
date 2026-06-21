import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Form } from '@/components/ui/Form';
import { ROUTES } from '@/config/routes';
import { Box, Button } from '@mantine/core';
import { getCreateCarSchema } from '../cars-schemas';
import { CreateCarRequest } from '../cars-types';
import { useCreateCar } from '../hooks/useCreateCar';
import { CarForm } from './CarForm';

export const CarCreateForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateCar();

  const methods = useForm({
    resolver: zodResolver(getCreateCarSchema(t)),
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      licensePlate: '',
      model: '',
      brand: '',
      horsepower: '',
    },
  });

  const onSubmit = (data: CreateCarRequest) => {
    mutate(data, {
      onSuccess: (response) => {
        const newId = response?.id;
        navigate(ROUTES.app.cars.view.getHref(newId));
        toast.success(t('cars:notifications.create.success'));
      },
    });
  };

  return (
    <Box>
      <Form
        methods={methods}
        onSubmit={onSubmit}
        formActions={
          <>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!methods.formState.isDirty || isPending}
            >
              {t('cars:actions.add_car')}
            </Button>
          </>
        }
      >
        <CarForm />
      </Form>
    </Box>
  );
};
