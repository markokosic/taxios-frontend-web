import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Alert, Group, NumberInput, Paper, SimpleGrid, Text } from '@mantine/core';
import { DriverRevenueOption, DriverRevenueOptionEntryCategory } from '@/api/generated/model';
import { ControlledNumberInput } from '@/shared/components/forms/ControlledNumberInput';
import { FormSelect } from '@/shared/components/forms/ControlledSelect';
import { useShiftRevenueRow } from '../../hooks/admin/useShiftRevenueRow';

interface ShiftRevenueRowProps {
  index: number;
  revenueOptions: DriverRevenueOption[];
  onRemove: (index: number) => void;
}

export const ShiftRevenueRow = ({ index, revenueOptions, onRemove }: ShiftRevenueRowProps) => {
  const { t } = useTranslation(['app', 'common']);

  const {
    fieldPrefix,
    rowValues,
    comboboxData,
    calculatedTotal,
    isWeeklyPaymentToday,
    weekdayName,
  } = useShiftRevenueRow(index, revenueOptions);

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
    >
      <Group
        justify="space-between"
        align="flex-start"
        mb="xs"
      >
        <Text
          fw={600}
          size="sm"
        >
          {t('app:shifts.revenue_entry')} #{index + 1}
        </Text>
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => onRemove(index)}
          aria-label={t('common:actions.delete')}
        >
          <Trash2 size={16} />
        </ActionIcon>
      </Group>

      <SimpleGrid
        cols={{
          base: 1,
          sm:
            rowValues.entryCategory === DriverRevenueOptionEntryCategory.FLAT_RATE
              ? 4
              : rowValues.entryCategory === DriverRevenueOptionEntryCategory.WEEKLY
                ? 3
                : 2,
        }}
        spacing="md"
      >
        <FormSelect
          name={`${fieldPrefix}.optionKey`}
          label={t('app:shifts.fields.revenue_type.label')}
          placeholder={t('app:shifts.fields.revenue_type.placeholder')}
          data={comboboxData}
          disabled={!!rowValues.id}
        />

        {rowValues.entryCategory === DriverRevenueOptionEntryCategory.FLAT_RATE ? (
          <>
            <ControlledNumberInput
              name={`${fieldPrefix}.tripCount`}
              label={t('app:shifts.fields.trip_count.label')}
              placeholder="1"
              min={1}
            />
            <ControlledNumberInput
              name={`${fieldPrefix}.pricePerTrip`}
              label={t('app:shifts.fields.price_per_trip.label')}
              placeholder="0,00"
              min={0}
              decimalScale={2}
              suffix=" €"
              readOnly={!!rowValues.flatRateTypeId}
            />
            <NumberInput
              label={t('app:shifts.fields.revenue.label')}
              value={calculatedTotal}
              readOnly
              disabled
              decimalScale={2}
              suffix=" €"
            />
          </>
        ) : rowValues.entryCategory === DriverRevenueOptionEntryCategory.WEEKLY ? (
          <ControlledNumberInput
            name={`${fieldPrefix}.weeklyDriverRent`}
            label={t('app:shifts.fields.weekly_rent.label', 'Wöchentliche Miete an Firma (€)')}
            placeholder="0,00"
            min={0}
            decimalScale={2}
            suffix=" €"
          />
        ) : (
          <ControlledNumberInput
            name={`${fieldPrefix}.revenue`}
            label={t('app:shifts.fields.revenue.label')}
            placeholder="0,00"
            min={0}
            decimalScale={2}
            suffix=" €"
          />
        )}
      </SimpleGrid>

      {rowValues.entryCategory === DriverRevenueOptionEntryCategory.WEEKLY && (
        <Alert
          mt="xs"
          variant="light"
          color={isWeeklyPaymentToday ? 'red' : 'blue'}
          title={
            isWeeklyPaymentToday
              ? t(
                  'app:shifts.weekly_settlement.share_due_today',
                  'Heute ist Zahltag / Abrechnungstag!'
                )
              : t('app:shifts.weekly_settlement.share_due_on', {
                  day: weekdayName,
                  defaultValue: `Abrechnungstag: ${weekdayName}`,
                })
          }
        >
          {isWeeklyPaymentToday
            ? t(
                'app:shifts.weekly_settlement.share_hint_today',
                'Für die gewählte Wochenpauschale ist heute der wöchentliche Firmenbeitrag fällig.'
              )
            : t('app:shifts.weekly_settlement.share_hint_other_day', {
                day: weekdayName,
                defaultValue: `Der wöchentliche Beitrag wird am ${weekdayName} abgerechnet.`,
              })}
        </Alert>
      )}
    </Paper>
  );
};
