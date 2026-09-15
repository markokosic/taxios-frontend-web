import { CalendarDays, Car, Clock, Route, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { ShiftResponse } from '@/api/generated/model';
import {
  calculateShiftDuration,
  formatShiftDate,
  formatShiftTime,
} from '../../domain/shift-calculations';
import { ShiftStatusBadge } from '../shared/ShiftStatusBadge';

interface ShiftViewMasterDataProps {
  shift: ShiftResponse;
}

export const ShiftViewMasterData = ({ shift }: ShiftViewMasterDataProps) => {
  const { t } = useTranslation(['app', 'common']);
  const shiftDuration = calculateShiftDuration(shift.shiftStart, shift.shiftEnd);

  return (
    <Card
      withBorder
      radius="md"
      p="lg"
      shadow="sm"
    >
      <Group
        justify="space-between"
        align="center"
        mb="md"
      >
        <Text
          fw={600}
          size="xl"
        >
          {t('app:shifts.groups.master_data')}
        </Text>
        <ShiftStatusBadge status={shift.status} />
      </Group>

      <Divider mb="lg" />

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing="xl"
      >
        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <User size={18} />
            <Text fw={500}>{t('app:shifts.table.driver')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {shift.driver ? `${shift.driver.firstName} ${shift.driver.lastName}` : '-'}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <Car size={18} />
            <Text fw={500}>{t('app:shifts.table.license_plate')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {shift.car ? shift.car.licensePlate : '-'}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <Car size={18} />
            <Text fw={500}>{t('app:shifts.table.car')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {shift.car ? `${shift.car.brand || ''} ${shift.car.model || ''}`.trim() || '-' : '-'}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <CalendarDays size={18} />
            <Text fw={500}>{t('app:shifts.fields.shift_start.label', 'Schichtbeginn')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {formatShiftDate(shift.shiftStart)} {formatShiftTime(shift.shiftStart)}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <CalendarDays size={18} />
            <Text fw={500}>{t('app:shifts.fields.shift_end.label', 'Schichtende')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {formatShiftDate(shift.shiftEnd)} {formatShiftTime(shift.shiftEnd)}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <Clock size={18} />
            <Text fw={500}>{t('common:labels.duration', 'Dauer')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {shiftDuration ? shiftDuration.text : '-'}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group
            gap="xs"
            c="dimmed"
          >
            <Route size={18} />
            <Text fw={500}>{t('app:shifts.table.km')}</Text>
          </Group>
          <Text
            fw={600}
            size="lg"
          >
            {shift.kilometersDriven !== undefined ? `${shift.kilometersDriven} km` : '-'}
          </Text>
          <Text c="dimmed">
            {shift.odometerStart} km - {shift.odometerEnd} km
          </Text>
        </Stack>
      </SimpleGrid>
    </Card>
  );
};
