import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { FloatingActionButton } from '@/shared/components/ui/FloatingActionButton';
import { ROUTES } from '@/config/routes';
import { FlatRatesList } from '../components/FlatRatesList';

export const FlatRatesPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigateToAddFlatRate = () => {
    navigate(ROUTES.app.flatrates.create.path);
  };

  const desktopActions = !isMobile ? (
    <Button
      leftSection={<Plus size={18} />}
      onClick={navigateToAddFlatRate}
    >
      {t('app:flatrate.actions.add')}
    </Button>
  ) : null;

  return (
    <PageLayout
      title={t('common:navigation.flatrates')}
      showBack={false}
      actions={desktopActions}
    >
      <FlatRatesList />
      {isMobile && (
        <FloatingActionButton onClick={navigateToAddFlatRate}>
          <Plus size={24} />
        </FloatingActionButton>
      )}
    </PageLayout>
  );
};

export default FlatRatesPage;
