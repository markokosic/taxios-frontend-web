import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { PageLayout } from '@/components/layout/PageLayout';
import { useMediaQuery } from '@mantine/hooks';
import { FloatingActionButton } from '@/components/ui/Button';
import { useGetDriver } from '@/api/generated/endpoints/drivers/drivers';
import { DriverUpdateForm } from '../components/DriverUpdateForm';

export const DriverPage = () => {
  const { t } = useTranslation();

  const { driverId } = useParams<{ driverId: string }>();

  const { data: response, isPending: isLoading } = useGetDriver(Number(driverId));

  const driver = response?.data;

  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isLoading) {
    return <p>bla</p>;
  }

  return (
    <PageLayout
      title={t('common:driver')}
      // actions={<ActionMenu actions={menuActions} />}
    >
      {driver && <DriverUpdateForm driver={driver} />}
      {isMobile && (
        <FloatingActionButton onClick={() => null}>
          <Plus size={24} />
        </FloatingActionButton>
      )}
    </PageLayout>
  );
};
