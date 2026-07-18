import dayjs from 'dayjs';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, LoadingOverlay } from '@mantine/core';
import { PageLayout } from '@/components/layout/PageLayout';
import { ReportFilters } from '../components/ReportFilters';
import { ReportSummary } from '../components/ReportSummary';
import { ReportTable } from '../components/ReportTable';
import { useGetRevenueReport } from '../hooks/useGetRevenueReport';
import { RevenueReportParams } from '../report-schema';

export const ReportPage = () => {
  const { t } = useTranslation(['app', 'common']);

  const [filters, setFilters] = useState<RevenueReportParams>({
    dateFrom: dayjs().startOf('month').format('YYYY-MM-DD'),
    dateTo: dayjs().endOf('month').format('YYYY-MM-DD'),
    driverId: null,
    groupBy: 'DAY',
  });

  const { data, isLoading, error } = useGetRevenueReport(filters);

  return (
    <PageLayout
      title={t('common:navigation.reports')}
      showBack={false}
    >
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />

        <ReportFilters
          filters={filters}
          setFilters={setFilters}
        />

        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('common:error')}
            color="red"
            mb="xl"
          >
            {error.message}
          </Alert>
        )}

        {!isLoading && !data && (
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('common:info')}
            color="blue"
            mb="xl"
          >
            {t('app:reports.no_data_info')}
          </Alert>
        )}

        <ReportSummary data={data} />

        <ReportTable
          data={data}
          isLoading={isLoading}
          groupBy={filters.groupBy}
        />
      </Box>
    </PageLayout>
  );
};
