import { Calendar, CalendarDays, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Stack, Tabs } from '@mantine/core';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import { MonthlyDashboardView } from '../../components/admin/MonthlyDashboardView';
import { YearlyDashboardView } from '../../components/admin/YearlyDashboardView';
import { PendingShiftsView } from '../../components/admin/PendingShiftsView';

export const AdminDashboardPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const { getFilter, setFilter } = useUrlFilters();

  const activeTab = getFilter('tab', 'pending_shifts');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const handleTabChange = (value: string | null) => {
    if (value) {
      setFilter('tab', value === 'pending_shifts' ? null : value);
    }
  };

  return (
    <PageLayout
      title={t('common:navigation.dashboard')}
      showBack={false}
    >
      <Stack
        gap="lg"
        pb="xl"
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="outline"
          radius="md"
        >
          <Tabs.List>
            <Tabs.Tab
              value="pending_shifts"
              leftSection={<Clock size={16} />}
            >
              {t('app:dashboard.tabs.pending_shifts', 'Ausstehende Schichten')}
            </Tabs.Tab>
            <Tabs.Tab
              value="month"
              leftSection={<Calendar size={16} />}
            >
              {t('app:dashboard.tabs.month')}
            </Tabs.Tab>
            <Tabs.Tab
              value="year"
              leftSection={<CalendarDays size={16} />}
            >
              {t('app:dashboard.tabs.year')}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel
            value="pending_shifts"
            pt="lg"
          >
            <PendingShiftsView />
          </Tabs.Panel>

          <Tabs.Panel
            value="month"
            pt="lg"
          >
            <MonthlyDashboardView
              year={year}
              month={month}
            />
          </Tabs.Panel>

          <Tabs.Panel
            value="year"
            pt="lg"
          >
            <YearlyDashboardView year={year} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </PageLayout>
  );
};

export default AdminDashboardPage;
