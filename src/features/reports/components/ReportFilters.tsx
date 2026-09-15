import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Group, Select, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDriverSelectOptions } from '@/features/drivers/hooks/useDriverOptions';
import { RevenueReportParams } from '../domain/reports-schemas';

type ReportFiltersProps = {
  filters: RevenueReportParams;
  setFilter: (key: string, value: string | number | boolean | null | undefined) => void;
};

export const ReportFilters = ({ filters, setFilter }: ReportFiltersProps) => {
  const { t } = useTranslation(['app', 'common']);
  const { driverOptions, isLoading: isLoadingDrivers, drivers } = useDriverSelectOptions();

  if (!drivers.length && !isLoadingDrivers) {
    return null;
  }

  const groupByOptions = [
    { value: 'NONE', label: t('app:reports.group_by_none') },
    { value: 'DAY', label: t('app:reports.group_by_day') },
    { value: 'MONTH', label: t('app:reports.group_by_month') },
    { value: 'YEAR', label: t('app:reports.group_by_year') },
  ];

  return (
    <Stack
      gap="md"
      mb="xl"
    >
      <Group
        grow
        align="flex-end"
      >
        <DatePickerInput
          label={t('app:reports.date_from')}
          placeholder={t('common:pick_date')}
          value={filters.dateFrom ? new Date(filters.dateFrom) : null}
          onChange={(date) => setFilter('dateFrom', date ? dayjs(date).format('YYYY-MM-DD') : null)}
          clearable
        />
        <DatePickerInput
          label={t('app:reports.date_to')}
          placeholder={t('common:pick_date')}
          value={filters.dateTo ? new Date(filters.dateTo) : null}
          onChange={(date) => setFilter('dateTo', date ? dayjs(date).format('YYYY-MM-DD') : null)}
          clearable
        />
      </Group>
      <Group
        grow
        align="flex-end"
      >
        <Select
          label={t('common:driver')}
          placeholder={t('common:select_driver')}
          data={driverOptions}
          value={filters.driverId}
          onChange={(value) => setFilter('driverId', value)}
          searchable
          clearable
          disabled={isLoadingDrivers}
        />
        <Select
          label={t('app:reports.group_by')}
          placeholder={t('common:select_grouping')}
          data={groupByOptions}
          value={filters.groupBy}
          onChange={(value) => setFilter('groupBy', value)}
        />
      </Group>
    </Stack>
  );
};
