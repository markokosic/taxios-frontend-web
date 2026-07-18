import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ActionIcon, Group, Paper, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useGetAllDriversForSelect } from '@/api/generated/endpoints/drivers/drivers';


export const RevenueFilters = () => {
  const { t } = useTranslation(['app', 'common']);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: drivers, isLoading: isLoadingDrivers } = useGetAllDriversForSelect();

  const driverId = searchParams.get('driverId') || '';
  const dateFromStr = searchParams.get('dateFrom') || '';
  const dateToStr = searchParams.get('dateTo') || '';

  const dateFrom = dateFromStr ? dayjs(dateFromStr).toDate() : null;
  const dateTo = dateToStr ? dayjs(dateToStr).toDate() : null;

  const driverOptions =
    drivers?.data?.map((driver) => ({
      value: driver.id?.toString() || '',
      label: driver.fullName || '',
    })) || [];

  const handleDriverChange = (val: string | null) => {
    setSearchParams((prev) => {
      if (val) {
        prev.set('driverId', val);
      } else {
        prev.delete('driverId');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleDateFromChange = (date: any) => {
    setSearchParams((prev) => {
      if (date) {
        prev.set('dateFrom', dayjs(date).format('YYYY-MM-DD'));
      } else {
        prev.delete('dateFrom');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleDateToChange = (date: any) => {
    setSearchParams((prev) => {
      if (date) {
        prev.set('dateTo', dayjs(date).format('YYYY-MM-DD'));
      } else {
        prev.delete('dateTo');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClearAll = () => {
    setSearchParams((prev) => {
      prev.delete('driverId');
      prev.delete('dateFrom');
      prev.delete('dateTo');
      prev.set('page', '1');
      return prev;
    });
  };

  const hasActiveFilters = !!driverId || !!dateFromStr || !!dateToStr;

  return (
    <Paper
      p="md"
      withBorder
      radius="md"
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
