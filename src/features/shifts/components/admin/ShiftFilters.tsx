import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Paper, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDriverSelectOptions } from '@/features/drivers/hooks/useDriverOptions';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';

export const ShiftFilters = () => {
  const { t } = useTranslation(['app', 'common']);
  const { getFilter, setFilter, clearFilters } = useUrlFilters();
  const { driverOptions, isLoading: isLoadingDrivers } = useDriverSelectOptions();

  const driverId = getFilter('driverId');
  const dateFromStr = getFilter('dateFrom');
  const dateToStr = getFilter('dateTo');

  const dateFrom = dateFromStr ? dayjs(dateFromStr).toDate() : null;
  const dateTo = dateToStr ? dayjs(dateToStr).toDate() : null;

  const handleDriverChange = (val: string | null) => {
    setFilter('page', null);
    setFilter('driverId', val);
  };
  const handleDateFromChange = (date: Date | string | null) => {
    setFilter('page', null);
    setFilter('dateFrom', date ? dayjs(date).format('YYYY-MM-DD') : null);
  };
  const handleDateToChange = (date: Date | string | null) => {
    setFilter('page', null);
    setFilter('dateTo', date ? dayjs(date).format('YYYY-MM-DD') : null);
  };
  const handleClearAll = () => {
    setFilter('page', null);
    clearFilters(['driverId', 'dateFrom', 'dateTo']);
  };

  const hasActiveFilters = !!driverId || !!dateFromStr || !!dateToStr;

  return (
    <Paper
      p="md"
      withBorder
      radius="md"
      mb="md"
    >
      <Group
        align="flex-end"
        grow
      >
        <Select
          label={t('common:driver')}
          placeholder={t('common:select_driver')}
          data={driverOptions}
          value={driverId}
          onChange={handleDriverChange}
          searchable
          clearable
          disabled={isLoadingDrivers}
        />
        <DatePickerInput
          label={t('app:reports.date_from')}
          placeholder={t('common:pick_date')}
          value={dateFrom}
          onChange={handleDateFromChange}
          clearable
        />
        <DatePickerInput
          label={t('app:reports.date_to')}
          placeholder={t('common:pick_date')}
          value={dateTo}
          onChange={handleDateToChange}
          clearable
        />
        {hasActiveFilters && (
          <ActionIcon
            variant="filled"
            color="red"
            w="fit"
            onClick={handleClearAll}
          >
            <X />
          </ActionIcon>
        )}
      </Group>
    </Paper>
  );
};
