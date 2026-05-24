import { useTranslation } from 'react-i18next';
import { Center, Loader, Stack, Title } from '@mantine/core';
import { PageLayout } from '@/components/layout/PageLayout';
import { DashboardSummary } from '@/features/reports/components/DashboardSummary';
import { useGetDashboardSummary } from '@/features/reports/hooks/useGetDashboardSummary';

const DashboardPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: monthData, isLoading: isMonthLoading } = useGetDashboardSummary({ year, month });
  const { data: yearData, isLoading: isYearLoading } = useGetDashboardSummary({ year });

  const isLoading = isMonthLoading || isYearLoading;

  return (
    <PageLayout
      title={t('common:navigation.dashboard')}
      showBack={false}
    >
      <Stack gap="xl">
        {isLoading ? (
          <Center h={200}>
            <Loader size="xl" />
          </Center>
        ) : (
          <>
            <DashboardSummary
              data={monthData}
              title={t('dashboard:monthly_summary', { month, year })}
            />
            <DashboardSummary
              data={yearData}
              title={t('dashboard:yearly_summary', { year })}
            />
          </>
        )}
      </Stack>
    </PageLayout>
  );
};

export default DashboardPage;
