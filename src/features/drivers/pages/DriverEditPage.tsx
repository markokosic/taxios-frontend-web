import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useGetDriver } from '@/api/generated/endpoints/drivers/drivers';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { DriverUpdateForm } from '../components/DriverUpdateForm';

export const DriverEditPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const { driverId } = useParams<{ driverId: string }>();

  const { data: response, isPending: isLoading, error } = useGetDriver(Number(driverId), {
    query: {
      enabled: !!driverId && !isNaN(Number(driverId)),
    },
  });

  const driver = response?.data;

  return (
    <PageLayout
      title={driver ? `${t('app:drivers.actions.edit_driver')}: ${driver.firstName} ${driver.lastName}` : t('common:driver')}
    >
      <DataLoadingWrapper
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !driver}
      >
        {driver && <DriverUpdateForm driver={driver} />}
      </DataLoadingWrapper>
    </PageLayout>
  );
};

export default DriverEditPage;
