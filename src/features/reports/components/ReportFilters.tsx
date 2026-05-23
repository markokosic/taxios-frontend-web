import { useTranslation } from 'react-i18next';
import { Group, Select, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useGetDriversForSelect } from '@/features/drivers/hooks/useGetDriversForSelect';
import {  RevenueReportParams } from '../report-schema';

type ReportFiltersProps = {
  filters: RevenueReportParams;
  setFilters: (filters: RevenueReportParams) => void;
};

export const ReportFilters = ({ filters, setFilters }: ReportFiltersProps) => {
  const { t } = useTranslation(['reports', 'common']);
  const { data: drivers, isLoading: isLoadingDrivers } = useGetDriversForSelect();

  const driverOptions =
    drivers?.map((driver) => ({
      value: driver.id.toString(),
      label: driver.fullName,
    })) || [];

  const groupByOptions = [
    { value: 'NONE', label: t('reports:group_by_none', { defaultValue: 'None' }) },
    { value: 'DAY', label: t('reports:group_by_day', { defaultValue: 'Day' }) },
    { value: 'MONTH', label: t('reports:group_by_month', { defaultValue: 'Month' }) },
    { value: 'YEAR', label: t('reports:group_by_year', { defaultValue: 'Year' }) },
    // { value: 'DRIVER', label: 'DRIVER' },
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
          label={t('reports:date_from', { defaultValue: 'Date From' })}
          placeholder={t('common:pick_date')}
          value={filters.dateFrom ? new Date(filters.dateFrom) : null}
          onChange={(date) =>
            setFilters({
              ...filters,
              dateFrom: date,
            })
          }
          clearable
        />
        <DatePickerInput
          label={t('reports:date_to', { defaultValue: 'Date To' })}
          placeholder={t('common:pick_date')}
          value={filters.dateTo ? new Date(filters.dateTo) : null}
          onChange={(date) =>
            setFilters({
              ...filters,
              dateTo: date,
            })
          }
          clearable
        />
      </Group>
      <Group
        grow
        align="flex-end"
      >
        <Select
          label={t('reports:driver', { defaultValue: 'Driver' })}
          placeholder={t('common:select_driver', { defaultValue: 'Select driver' })}
          data={driverOptions}
          value={filters.driverId}
          onChange={(value) => setFilters({ ...filters, driverId: value })}
          searchable
          clearable
          disabled={isLoadingDrivers}
        />
        <Select
          label={t('reports:group_by', { defaultValue: 'Group By' })}
          placeholder={t('common:select_grouping', { defaultValue: 'Select grouping' })}
          data={groupByOptions}
          value={filters.groupBy}
          onChange={(value) => setFilters({ ...filters, groupBy: value as any })}
        />
      </Group>
    </Stack>
  );
};
