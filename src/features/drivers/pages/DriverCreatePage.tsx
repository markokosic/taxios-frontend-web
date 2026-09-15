import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DriverCreateForm } from '../components/DriverCreateForm';

export const DriverCreatePage = () => {
  const { t } = useTranslation(['app', 'common']);


  return (
    <PageLayout title={t('app:drivers.actions.add_driver')}>
      <DriverCreateForm />
    </PageLayout>
  );
};

export default DriverCreatePage;

