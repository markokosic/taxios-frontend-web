import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DriverShiftQuickForm } from '../../components/driver/DriverShiftQuickForm';

export const DriverCreateShiftPage = () => {
  const { t } = useTranslation(['app', 'common']);

  return (
    <PageLayout title={t('app:shifts.driver_create_title', 'Schicht eintragen')}>
      <DriverShiftQuickForm />
    </PageLayout>
  );
};

export default DriverCreateShiftPage;
