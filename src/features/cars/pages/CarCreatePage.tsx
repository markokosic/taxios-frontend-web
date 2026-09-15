import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { CarCreateForm } from '../components/CarCreateForm';

export const CarCreatePage = () => {
  const { t } = useTranslation(['app', 'common']);

  return (
    <PageLayout
      title={t('app:cars.pages.create_car.title')}
      showBack
    >
      <CarCreateForm />
    </PageLayout>
  );
};

export default CarCreatePage;

