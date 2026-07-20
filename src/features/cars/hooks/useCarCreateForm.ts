import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { CreateCarMutationBody, useCreateCar } from '@/api/generated/endpoints/cars/cars';
import { CreateCarBody } from '@/api/generated/zod/cars/cars';
import { ROUTES } from '@/config/routes';


export const useCarCreateForm = () => {
  const { t } = useTranslation(['app', 'errors']);
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateCar();

  const methods = useForm<CreateCarMutationBody>({
    resolver: zodResolver(CreateCarBody),
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      licensePlate: '',
      model: '',
      brand: '',
      horsepower: '',
    },
  });

  const onSubmit = (data: CreateCarMutationBody) => {
    mutate(
      { data },
      {
        onSuccess: (response) => {
          const newId = response?.data?.id;
          if (newId) {
            navigate(ROUTES.app.cars.view.getHref(newId));
          }
          toast.success(t('app:cars.notifications.create.success'));
        },
      }
    );
  };

  return {
    methods,
    onSubmit,
    isPending,
    cancel: () => navigate(-1),
  };
};
