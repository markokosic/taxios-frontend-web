import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from 'src/components/layout/PageLayout';
import { Alert, Box, LoadingOverlay } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import { useGetRevenueReport } from '../hooks/useGetRevenueReport';
import { RevenueReportParams } from '../report-schema';
import { ReportFilters } from '../components/ReportFilters';
import { ReportSummary } from '../components/ReportSummary';
import { ReportTable } from '../components/ReportTable';

export const ReportPage = () => {
  const { t } = useTranslation(['reports', 'common']);
  
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
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        
        <ReportFilters filters={filters} setFilters={setFilters} />

        {error && (
          <Alert icon={<AlertCircle size={16} />} title="Error" color="red" mb="xl">
            {error.message}
          </Alert>
        )}

        {!isLoading && !data && (
          <Alert icon={<AlertCircle size={16} />} title="Info" color="blue" mb="xl">
            {t('reports:no_data_info', { defaultValue: 'Please select a date range and filters to see the report.' })}
          </Alert>
        )}

        <ReportSummary data={data} />
        
        <ReportTable data={data} isLoading={isLoading} groupBy={filters.groupBy} />
      </Box>
    </PageLayout>
  );
};
