import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { CreateNewFlatRateForm } from '../components/CreateNewFlatRateForm';

export const CreateNewFlatRatePage = () => {
  const { t } = useTranslation(['app', 'common']);

  return (
    <PageLayout title={t('app:flatrate.create_page_title')}>
      <CreateNewFlatRateForm />
    </PageLayout>
  );
};

export default CreateNewFlatRatePage;