import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { PageLayout } from 'src/components/layout/PageLayout';
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
      title={t('cars:car')}
      showBack={true}
    >
      {car && <CarUpdateForm car={car} />}
    </PageLayout>
  );
};
