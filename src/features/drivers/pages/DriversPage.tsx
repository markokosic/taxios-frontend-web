import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { FloatingActionButton } from '@/shared/components/ui/FloatingActionButton';
import { ROUTES } from '@/config/routes';
import { DriversList } from '../components/DriversList';

export const DriversPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigateToAddDriver = () => {
    navigate(ROUTES.app.drivers.create.path);
  };

  const desktopActions = !isMobile ? (
    <Button
      leftSection={<Plus />}
      onClick={navigateToAddDriver}
    >
      {t('app:drivers.actions.add_driver')}
    </Button>
  ) : null;

  return (
    <PageLayout
      title={t('common:navigation.drivers')}
      showBack={false}
      actions={desktopActions}
      fullHeight
    >
      <DriversList />
      {isMobile && (
        <FloatingActionButton onClick={navigateToAddDriver}>
          <Plus size={24} />
        </FloatingActionButton>
      )}
    </PageLayout>
  );
};

export default DriversPage;

