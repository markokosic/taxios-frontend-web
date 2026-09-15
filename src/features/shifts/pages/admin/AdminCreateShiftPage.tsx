import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { AdminShiftForm } from '../../components/admin/AdminShiftForm';
import { ROUTES } from '@/config/routes';

export const AdminCreateShiftPage = () => {
  const { t } = useTranslation(['app', 'common']);

  return (
    <PageLayout backTo={ROUTES.app.shifts.getHref()} title={t('app:shifts.create_page_title')}>
      <AdminShiftForm />
    </PageLayout>
  );
};

export default AdminCreateShiftPage;
