import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { CreateNewFlatRateForm } from '../components/CreateNewFlatRateForm';
import { ROUTES } from '@/config/routes';

export const CreateNewFlatRatePage = () => {
  const { t } = useTranslation(['app', 'common']);

  return (
    <PageLayout backTo={ROUTES.app.flatrates.getHref()} title={t('app:flatrate.create_page_title')}>
      <CreateNewFlatRateForm />
    </PageLayout>
  );
};

export default CreateNewFlatRatePage;