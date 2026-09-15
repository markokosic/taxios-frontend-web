import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { AdminShiftForm } from '../../components/admin/AdminShiftForm';

export const AdminCreateShiftPage = () => {
  const { t } = useTranslation(['app', 'common']);

  return (
    <PageLayout title={t('app:shifts.create_page_title')}>
      <AdminShiftForm />
    </PageLayout>
  );
};

export default AdminCreateShiftPage;
