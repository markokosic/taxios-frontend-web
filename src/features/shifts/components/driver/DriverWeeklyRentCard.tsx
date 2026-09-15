import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Card, Stack } from '@mantine/core';
import { ControlledNumberInput } from '@/shared/components/forms/ControlledNumberInput';
import { checkWeeklySettlement } from '../../domain/shift-calculations';

interface DriverWeeklyRentCardProps {
  defaultRentPrice?: number;
  settlementDay?: number;
}

export const DriverWeeklyRentCard = ({
  defaultRentPrice,
  settlementDay = 7,
}: DriverWeeklyRentCardProps) => {
  const { t } = useTranslation(['app', 'common']);
  const { setValue, getValues } = useFormContext();

  const [shiftStart] = useWatch({
    name: ['shiftStart'],
  });

  const { isWeeklyPaymentToday, weekdayName } = checkWeeklySettlement(shiftStart, settlementDay);

  useEffect(() => {
    if (defaultRentPrice !== undefined && defaultRentPrice !== null) {
      const current = getValues('weeklyRentPaid');
      if (current === undefined || current === null || current === '') {
        setValue('weeklyRentPaid', isWeeklyPaymentToday ? defaultRentPrice : 0, { shouldValidate: true });
      }
    }
  }, [isWeeklyPaymentToday, defaultRentPrice, getValues, setValue]);

  return (
    <Card
      withBorder
      radius="md"
      p="md"
      shadow="xs"
    >
      <Stack gap="sm">
        {isWeeklyPaymentToday && (
          <Alert
            color="orange"
            variant="light"
            radius="md"
            title={`Abrechnungstag (${weekdayName})`}
          >
            Heute ist der wöchentliche Abrechnungstag für den Firmenanteil
            {defaultRentPrice ? ` (${defaultRentPrice.toFixed(2)} €)` : ''}.
          </Alert>
        )}

        <ControlledNumberInput
          name="weeklyRentPaid"
          label={t('app:revenues.fields.weekly_company_share', 'Wöchentlicher Firmenanteil an Firma')}
          placeholder={defaultRentPrice ? `${defaultRentPrice.toFixed(2)}` : '0.00'}
          min={0}
          decimalScale={2}
          suffix=" €"
          inputMode="decimal"
          withAsterisk
        />
      </Stack>
    </Card>
  );
};
