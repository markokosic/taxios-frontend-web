import { Plus, Clock, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Stack, Tabs } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GetAllShiftsStatus } from '@/api/generated/model';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { FloatingActionButton } from '@/shared/components/ui/FloatingActionButton';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import { ROUTES } from '@/config/routes';
import { AdminShiftsList } from '../../components/admin/AdminShiftsList';

export const AdminShiftsPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { getFilter, setFilter } = useUrlFilters();

  const activeTab = getFilter('tab', 'pending');

  const handleTabChange = (value: string | null) => {
    if (value) {
      setFilter('tab', value === 'pending' ? null : value);
    }
  };

  const navigateToAddShift = () => {
    navigate(ROUTES.app.shifts.create.path);
  };

  const desktopActions = !isMobile ? (
    <Button
      leftSection={<Plus size={18} />}
      onClick={navigateToAddShift}
    >
      {t('app:shifts.actions.add')}
    </Button>
  ) : null;

  return (
    <PageLayout
      title={t('common:navigation.shifts')}
      showBack={false}
      actions={desktopActions}
    >
      <Stack gap="lg" pb="xl">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="outline"
          radius="md"
        >
          <Tabs.List>
            <Tabs.Tab
              value="pending"
              leftSection={<Clock size={16} />}
            >
              {t('app:shifts.tabs.pending', 'Ausstehende Schichten')}
            </Tabs.Tab>
            <Tabs.Tab
              value="all"
              leftSection={<List size={16} />}
            >
              {t('app:shifts.tabs.all', 'Alle Schichten')}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pending" pt="lg">
            <AdminShiftsList status={GetAllShiftsStatus.PENDING} />
          </Tabs.Panel>

          <Tabs.Panel value="all" pt="lg">
            <AdminShiftsList />
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {isMobile && (
        <FloatingActionButton onClick={navigateToAddShift}>
          <Plus size={24} />
        </FloatingActionButton>
      )}
    </PageLayout>
  );
};

export default AdminShiftsPage;
