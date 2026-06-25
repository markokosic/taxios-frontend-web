import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { PageLayout } from '@/components/layout/PageLayout';
import { CarUpdateForm } from '../components/CarUpdateForm';
import { useGetCar } from '../hooks/useGetCar';

export const CarPage = () => {
  const { t } = useTranslation();
  const { carId } = useParams<{ carId: string }>();

  const { data: car, isLoading, error } = useGetCar(Number(carId));

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
