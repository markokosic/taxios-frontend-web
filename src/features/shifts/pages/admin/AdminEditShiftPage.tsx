import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useGetShiftById } from '@/api/generated/endpoints/shifts/shifts';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { AdminEditShiftForm } from '../../components/admin/AdminEditShiftForm';

export const AdminEditShiftPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const { shiftId } = useParams<{ shiftId: string }>();

  const {
    data: response,
    isLoading,
    error,
  } = useGetShiftById(Number(shiftId), {
    query: {
      enabled: !!shiftId && !isNaN(Number(shiftId)),
    },
  });

  const shift = response?.data;

  return (
    <PageLayout
      title={`${t('app:shifts.edit_page_title')} #${shiftId}`}
      showBack
    >
      <DataLoadingWrapper
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !shift}
      >
        {shift && <AdminEditShiftForm shift={shift} />}
      </DataLoadingWrapper>
    </PageLayout>
  );
};

export default AdminEditShiftPage;
