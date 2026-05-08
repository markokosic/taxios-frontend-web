
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@mantine/core';
import { PageLayout } from '@/components/layout/PageLayout';
import { Form } from '@/components/ui/Form';

import { CreateRevenueRecordsBulkForm } from '../components/CreateRevenueRecordsBulkForm';

export const CreateDailyRevenuesPage = () => {
  const { t } = useTranslation();


  return (
    <PageLayout title={t('revenues:record_revenue.daily')}>
      <CreateRevenueRecordsBulkForm/>
    </PageLayout>
  );
};
