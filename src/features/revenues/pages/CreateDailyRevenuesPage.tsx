
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/components/layout/PageLayout';

import { CreateRevenueRecordsBulkForm } from '../components/CreateRevenueRecordsBulkForm';

export const CreateDailyRevenuesPage = () => {
  const { t } = useTranslation();


  return (
    <PageLayout title={t('revenues:record_revenue.daily')}>
      <CreateRevenueRecordsBulkForm/>
    </PageLayout>
  );
};
