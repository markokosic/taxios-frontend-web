
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout/PageLayout';

import { CreateRevenueRecordsBulkForm } from '../components/CreateRevenueRecordsBulkForm';

export const CreateDailyRevenuesPage = () => {
  const { t } = useTranslation(['app', 'common']);


  return (
    <PageLayout title={t('app:revenues.record_revenue.daily')}>
      <CreateRevenueRecordsBulkForm/>
    </PageLayout>
  );
};
