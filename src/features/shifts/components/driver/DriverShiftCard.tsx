import { CalendarDays, Car, ChevronRight, Clock, Route, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, Card, Divider, Group, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { ShiftResponse } from '@/api/generated/model';
import { createFormatters } from '@/shared/utils';
import {
  calculateShiftDuration,
  calculateShiftTotals,
  formatShiftDate,
  formatShiftTime,
} from '../../domain/shift-calculations';
import { ShiftStatusBadge } from '../shared/ShiftStatusBadge';

export interface DriverShiftCardProps {
  shift: ShiftResponse;
  onClick?: () => void;
}

export const DriverShiftCard = ({ shift, onClick }: DriverShiftCardProps) => {
  const { t, i18n } = useTranslation(['app', 'common']);
  const fmt = createFormatters(i18n.language);

  const dateFormatted = formatShiftDate(shift.shiftStart);
  const timeFormatted = `${formatShiftTime(shift.shiftStart)} - ${formatShiftTime(shift.shiftEnd)}`;
  const duration = calculateShiftDuration(shift.shiftStart, shift.shiftEnd);
  const totals = calculateShiftTotals(shift);

  return (
    <Card
      withBorder
      radius="md"
      p="md"
      shadow="xs"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
      }}
    >
      {/* Header: Date + ID + Status */}
      <Group justify="space-between" align="center" mb="xs">
        <Group gap="xs">
          <ThemeIcon variant="light" color="blue" radius="md" size="md">
            <CalendarDays size={16} />
          </ThemeIcon>
          <Text fw={700} size="sm">
            {dateFormatted}
          </Text>
          {shift.id && (
            <Badge variant="subtle" color="gray" size="sm">
              #{shift.id}
            </Badge>
          )}
        </Group>

        <Group gap="xs">
          <ShiftStatusBadge status={shift.status} />
          {onClick && <ChevronRight size={18} style={{ opacity: 0.4 }} />}
        </Group>
      </Group>

      <Divider my="xs" color="gray.1" />

      {/* Details Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        {/* Zeit & Dauer */}
        <Group gap="xs" wrap="nowrap">
          <Clock size={16} style={{ flexShrink: 0, opacity: 0.6 }} />
          <Text size="sm" c="dimmed">
            {timeFormatted} {duration ? `(${duration.hours}h ${duration.minutes > 0 ? `${duration.minutes}m` : ''})` : ''}
          </Text>
        </Group>

        {/* Fahrzeug */}
        <Group gap="xs" wrap="nowrap">
          <Car size={16} style={{ flexShrink: 0, opacity: 0.6 }} />
          <Text size="sm" fw={500}>
            {shift.car?.licensePlate ?? t('common:no_car', 'Kein Fahrzeug')}
            {shift.car?.brand && ` • ${shift.car.brand} ${shift.car.model ?? ''}`}
          </Text>
        </Group>

        {/* Kilometer */}
        {shift.kilometersDriven !== undefined && shift.kilometersDriven !== null && (
          <Group gap="xs" wrap="nowrap">
            <Route size={16} style={{ flexShrink: 0, opacity: 0.6 }} />
            <Text size="sm" c="dimmed">
              {shift.kilometersDriven} km
            </Text>
          </Group>
        )}

        {/* Gesamtumsatz */}
        <Group gap="xs" wrap="nowrap">
          <Wallet size={16} style={{ flexShrink: 0, opacity: 0.6 }} />
          <Text size="sm" fw={600} c="blue.7">
            {t('app:shifts.table.total_revenue', 'Gesamtumsatz')}: {fmt.number(totals.totalRevenue)} €
          </Text>
        </Group>
      </SimpleGrid>
    </Card>
  );
};

