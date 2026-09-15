import { useTranslation } from 'react-i18next';
import { Badge, Card, Flex, Group, Paper, Stack, Text, Divider } from '@mantine/core';
import {
  ShiftResponse,
  ShiftRevenueEntryResponseEntryCategory,
} from '@/api/generated/model';
import { createFormatters } from '@/shared/utils';
import { RemunerationModelType } from '@/features/drivers/domain/remuneration-types';

interface ShiftViewRevenuesProps {
  shift: ShiftResponse;
}

export const ShiftViewRevenues = ({ shift }: ShiftViewRevenuesProps) => {
  const revenues = shift.revenues || [];
  const isWeekly = (shift.appliedRemunerationConfigs || []).some(
    (c) => c.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE
  );
  const { t, i18n } = useTranslation(['app', 'common']);
  const fmt = createFormatters(i18n.language);

  const regularRevenues = revenues.filter(
    (r) => r.entryCategory === ShiftRevenueEntryResponseEntryCategory.REGULAR
  );
  const flatRateRevenues = revenues.filter(
    (r) => r.entryCategory === ShiftRevenueEntryResponseEntryCategory.FLAT_RATE
  );

  const sumRegular = regularRevenues.reduce((acc, rev) => acc + (rev.revenue || 0), 0);
  const sumFlatRate = flatRateRevenues.reduce((acc, rev) => acc + (rev.revenue || 0), 0);
  const totalRevenue = sumRegular + sumFlatRate;

  return (
    <Stack gap="xl">
      <Text
        fw={600}
        size="xl"
      >
        {t('app:shifts.groups.revenues')}
      </Text>

      {(!revenues.length && !isWeekly) && (
        <Paper
          withBorder
          p="xl"
          radius="md"
          ta="center"
        >
          <Text
            c="dimmed"
            size="lg"
          >
            {t('app:shifts.empty', 'Keine Umsätze vorhanden.')}
          </Text>
        </Paper>
      )}

      {regularRevenues.length > 0 && (
        <Stack gap="md">
          <Text fw={600} size="lg">{t('app:shifts.regular_rides', 'Cash Fahrten')}</Text>
          {regularRevenues.map((rev, idx) => (
            <Card key={rev.id || idx} withBorder radius="md" shadow="sm" p="md">
              <Flex direction={{ base: 'column', sm: 'row' }} gap="md" justify="space-between" align={{ base: 'flex-start', sm: 'center' }}>
                <Group gap="sm">
                  <Badge variant="light" color="blue" size="lg">
                    {t('app:shifts.regular_rides', 'Cash Fahrten')}
                  </Badge>
                </Group>
                <Text fw={600} size="lg">
                  {rev.revenue ? fmt.number(rev.revenue) : '0,00'} €
                </Text>
              </Flex>
            </Card>
          ))}
          <Group justify="flex-end" px="sm" mt="xs">
            <Text c="dimmed" tt="uppercase" fw={500} size="sm">{t('app:shifts.sum_cash_rides', 'Summe Cash Fahrten:')}</Text>
            <Text fw={700} size="xl">{fmt.number(sumRegular)} €</Text>
          </Group>
          <Divider variant="dashed" />
        </Stack>
      )}

      {flatRateRevenues.length > 0 && (
        <Stack gap="md">
          <Text fw={600} size="lg">{t('app:shifts.city_taxi_rides')}</Text>
          {flatRateRevenues.map((rev, idx) => (
            <Card key={rev.id || idx} withBorder radius="md" shadow="sm" p="md">
              <Flex direction={{ base: 'column', sm: 'row' }} gap="md" justify="space-between" align={{ base: 'flex-start', sm: 'center' }}>
                <Stack gap="xs">
                  <Group gap="sm">
                    <Badge variant="light" color="blue" size="lg">
                      {rev.flatRateTypeName || rev.entryCategory}
                    </Badge>
                  </Group>
                  <Text c="dimmed" size="sm">
                    {rev.tripCount || 1} {t('app:dashboard.trip_count')} ×{' '}
                    {rev.pricePerTrip ? fmt.number(rev.pricePerTrip) : '0,00'} €
                  </Text>
                </Stack>
                <Text fw={600} size="lg">
                  {rev.revenue ? fmt.number(rev.revenue) : '0,00'} €
                </Text>
              </Flex>
            </Card>
          ))}
          <Group justify="flex-end" px="sm" mt="xs">
            <Text c="dimmed" tt="uppercase" fw={500} size="sm">{t('app:shifts.sum_city_taxi_rides')}</Text>
            <Text fw={700} size="xl">{fmt.number(sumFlatRate)} €</Text>
          </Group>
          <Divider variant="dashed" />
        </Stack>
      )}

      {(regularRevenues.length > 0 || flatRateRevenues.length > 0) && (
        <Paper withBorder p="md" radius="md" bg="blue.0" mt="md">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Text size="sm" fw={600} tt="uppercase" c="blue.9">
              {t('app:shifts.table.total_revenue', 'Gesamtumsatz')}
            </Text>
            <Text fw={800} size="xl" c="blue.8">
              {fmt.number(totalRevenue)} €
            </Text>
          </Group>
        </Paper>
      )}

      {isWeekly && (
        <Stack gap="md">
          <Text fw={600} size="lg">{t('app:shifts.groups.company_share')}</Text>
          <Card withBorder radius="md" shadow="sm" p="md">
            <Flex direction={{ base: 'column', sm: 'row' }} gap="md" justify="space-between" align={{ base: 'flex-start', sm: 'center' }}>
              <Stack gap="xs">
                <Group gap="sm">
                  <Badge variant="light" color="grape" size="lg">
                    {t('app:remuneration.weekly_fixed_rate')}
                  </Badge>
                </Group>
                <Text c="dimmed" size="sm">
                  {t('app:shifts.weekly_settlement.share_hint_today')}
                </Text>
              </Stack>
              <Text fw={600} size="lg">
                {shift.weeklyDriverRent !== undefined && shift.weeklyDriverRent !== null
                  ? fmt.number(shift.weeklyDriverRent)
                  : '0,00'} €
              </Text>
            </Flex>
          </Card>
          <Group justify="flex-end" px="sm" mt="xs">
            <Text c="dimmed" tt="uppercase" fw={500} size="sm">{t('app:shifts.sum_company_share')}</Text>
            <Text fw={700} size="xl">
              {shift.weeklyDriverRent !== undefined && shift.weeklyDriverRent !== null
                  ? fmt.number(shift.weeklyDriverRent)
                  : '0,00'} €
            </Text>
          </Group>
        </Stack>
      )}
    </Stack>
  );
};
