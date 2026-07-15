import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useGetCar } from '@/api/generated/endpoints/cars/cars';
import { PageLayout } from '@/components/layout/PageLayout';
import { CarUpdateForm } from '../components/CarUpdateForm';
import { CarResponse } from '@/api/generated/model';

export const CarPage = () => {
  const { t } = useTranslation();
  const { carId } = useParams<{ carId: string }>();

  const { data: car, isLoading } = useGetCar<CarResponse>(Number(carId), {
    query: {
      select: (response) => response.data!,
    },
  });

  if (isLoading) {
    return null; // TODO: Add skeleton
  }

  return (
    <PageLayout
      title={t('common:car')}
      showBack
    >
      {car && <CarUpdateForm car={car} />}
    </PageLayout>
  );
};
