import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { UpdateCarMutationBody, useUpdateCar } from '@/api/generated/endpoints/cars/cars';
import { CarResponse } from '@/api/generated/model';
import { UpdateCarBody } from '@/api/generated/zod/cars/cars';


export const useCarUpdateForm = (car: CarResponse) => {
  const { t } = useTranslation(['app', 'errors']);
  const { mutate, isPending } = useUpdateCar();

  const methods = useForm<UpdateCarMutationBody>({
    resolver: zodResolver(UpdateCarBody),
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      brand: car.brand || '',
      model: car.model || '',
      licensePlate: car.licensePlate || '',
      horsepower: car.horsepower || '',
    },
  });

  const onSubmit = (data: UpdateCarMutationBody) => {
    mutate(
      { id: car.id!, data },
      {
        onSuccess: () => {
          toast.success(t('app:cars.notifications.update.success'));
          methods.reset(data);
        },
      }
    );
  };

  return {
    methods,
    onSubmit,
    isPending,
  };
};
