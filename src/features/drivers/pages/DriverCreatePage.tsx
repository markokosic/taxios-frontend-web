import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout/PageLayout';
import { DriverCreateForm } from '../components/DriverCreateForm';

export const DriverCreatePage = () => {
  const { t } = useTranslation();


  return (
    <PageLayout title={t('drivers:actions.add_driver')}>
      <DriverCreateForm />
    </PageLayout>
  );
};
