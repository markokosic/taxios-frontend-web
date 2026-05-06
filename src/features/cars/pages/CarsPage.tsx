import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { PageLayout } from '@/components/layout/PageLayout';
import { FloatingActionButton } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';
import { CarsList } from '../components/CarsList';

export const CarsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigateToAddCar = () => {
    navigate(ROUTES.app.cars.create.path);
  };

  const desktopActions = !isMobile ? (
    <Button
      leftSection={<Plus />}
      onClick={navigateToAddCar}
    >
      {t('cars:actions.add_car')}
    </Button>
  ) : null;

  return (
    <PageLayout
      title={t('common:navigation.cars')}
      showBack={false}
      actions={desktopActions}
    >
      <CarsList />
      {isMobile && (
        <FloatingActionButton onClick={navigateToAddCar}>
          <Plus size={24} />
        </FloatingActionButton>
      )}
    </PageLayout>
  );
};
