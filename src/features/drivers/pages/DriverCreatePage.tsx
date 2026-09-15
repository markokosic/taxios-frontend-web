import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DriverCreateForm } from '../components/DriverCreateForm';
import { ROUTES } from '@/config/routes';

export const DriverCreatePage = () => {
  const { t } = useTranslation(['app', 'common']);


  return (
    <PageLayout backTo={ROUTES.app.drivers.getHref()} title={t('app:drivers.actions.add_driver')}>
      <DriverCreateForm />
    </PageLayout>
  );
};

export default DriverCreatePage;

