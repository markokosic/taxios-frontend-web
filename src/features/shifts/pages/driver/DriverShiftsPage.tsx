import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ROUTES } from '@/config/routes';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { FloatingActionButton } from '@/shared/components/ui/FloatingActionButton';
import { DriverShiftsList } from '../../components/driver/DriverShiftsList';

export const DriverShiftsPage = () => {
  const { t } = useTranslation(['common', 'app']);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigateToAddShift = () => {
    navigate(ROUTES.app.driver.shifts.create.path);
  };

  const desktopActions = !isMobile ? (
    <Button leftSection={<Plus size={18} />} onClick={navigateToAddShift}>
      {t('app:shifts.actions.add', 'Schicht eintragen')}
    </Button>
  ) : null;

  return (
    <PageLayout
      title={t('common:navigation.shifts')}
      showBack={false}
      actions={desktopActions}
    >
      <DriverShiftsList />

      {isMobile && (
        <FloatingActionButton onClick={navigateToAddShift}>
          <Plus size={24} />
        </FloatingActionButton>
      )}
    </PageLayout>
  );
};

export default DriverShiftsPage;

