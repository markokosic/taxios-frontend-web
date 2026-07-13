import { Trash } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Box, Group, Paper, Text } from '@mantine/core';
import { DAYS_OF_THE_WEEK } from '@/common/constants';
import { ControlledNumberInput } from '@/components/ui/ControlledNumberInput/ControlledNumberInput';
import { ControlledCombobox } from '@/components/ui/ControlledSelect/ControlledCombobox';
import { FieldGroup } from '@/components/ui/Form';
import { REMUNERATION_FORM_FIELDS } from '@/features/remuneration/config/remuneration-form-fields';
import { RemunerationModelType } from '@/features/remuneration/remuneration-types';

type DriverFormRemunerationConfigRowType = {
  index: number;
  remove: (index: number) => void;
};

export const DriverFormRemunerationConfigRow = ({
  index,
  remove,
}: DriverFormRemunerationConfigRowType) => {
  const { t } = useTranslation(['app', 'common']);

  const remunerationTypes = [
    {
      label: t('app:remuneration.type.percentageShare'),
      value: RemunerationModelType.PERCENTAGE_SHARE,
    },
    {
      label: t('app:remuneration.type.weeklyFixedRate'),
      value: RemunerationModelType.WEEKLY_FIXED_RATE,
    },
    {
      label: t('app:remuneration.type.flatRate'),
      value: RemunerationModelType.FLAT_RATE,
    },
  ];

  const selectedType = useWatch({
    name: `remunerationConfigs.${index}.remunerationModelType`,
  });

  const dayOptions = DAYS_OF_THE_WEEK.map((day) => ({
    value: day.value,
    label: t(day.label),
  }));

  const namePrefix = `remunerationConfigs.${index}`;

  return (
    <Paper withBorder>
      <Box p="md">
        <Group justify="space-between">
          <Text fw={700}>
            {t('app:remuneration.driver_remuneration')} {`${index + 1}`}
          </Text>
          <ActionIcon
            color="red"
            variant="light"
            size="lg"
            onClick={() => remove(index)}
          >
            <Trash size={18} />
          </ActionIcon>
        </Group>
        <ControlledCombobox
          name={`${namePrefix}.remunerationModelType`}
          label={t(REMUNERATION_FORM_FIELDS.type.labelKey)}
          placeholder={t(REMUNERATION_FORM_FIELDS.type.placeholderKey)}
          data={remunerationTypes}
        />

        {selectedType === RemunerationModelType.PERCENTAGE_SHARE && (
          <FieldGroup columnConfig={{ desktop: { columns: 2 }, mobile: { columns: 1 } }}>
            <ControlledNumberInput
              min={0}
              suffix="€"
              name={`${namePrefix}.${REMUNERATION_FORM_FIELDS.percentageShare.minDriverPayout.name}`}
              label={t(REMUNERATION_FORM_FIELDS.percentageShare.minDriverPayout.labelKey)}
              placeholder={t(
                REMUNERATION_FORM_FIELDS.percentageShare.minDriverPayout.placeholderKey
              )}
            />
            <ControlledNumberInput
              min={0}
              max={100}
              clampBehavior="strict"
              suffix="%"
              name={`${namePrefix}.${REMUNERATION_FORM_FIELDS.percentageShare.driverRevenueSharePercentage.name}`}
              label={t(
                REMUNERATION_FORM_FIELDS.percentageShare.driverRevenueSharePercentage.labelKey
              )}
              placeholder={t(
                REMUNERATION_FORM_FIELDS.percentageShare.driverRevenueSharePercentage.placeholderKey
              )}
            />
          </FieldGroup>
        )}

        {selectedType === RemunerationModelType.WEEKLY_FIXED_RATE && (
          <FieldGroup columnConfig={{ desktop: { columns: 2 }, mobile: { columns: 1 } }}>
            <ControlledNumberInput
              min={0}
              suffix="€"
              name={`${namePrefix}.${REMUNERATION_FORM_FIELDS.weeklyFixedRate.weeklyFixedCompanySettlement.name}`}
              label={t(
                REMUNERATION_FORM_FIELDS.weeklyFixedRate.weeklyFixedCompanySettlement.labelKey
              )}
              placeholder={t(
                REMUNERATION_FORM_FIELDS.weeklyFixedRate.weeklyFixedCompanySettlement.placeholderKey
              )}
            />
            <ControlledCombobox
              name={`${namePrefix}.${REMUNERATION_FORM_FIELDS.weeklyFixedRate.settlementDay.name}`}
              label={t(REMUNERATION_FORM_FIELDS.weeklyFixedRate.settlementDay.labelKey)}
              placeholder={t(REMUNERATION_FORM_FIELDS.weeklyFixedRate.settlementDay.placeholderKey)}
              data={dayOptions}
            />
          </FieldGroup>
        )}

        {selectedType === RemunerationModelType.FLAT_RATE && (
          <FieldGroup columnConfig={{ desktop: { columns: 1 }, mobile: { columns: 1 } }}>
            <ControlledNumberInput
              min={0}
              suffix="€"
              name={`${namePrefix}.${REMUNERATION_FORM_FIELDS.flatRate.flatRateFee.name}`}
              label={t(REMUNERATION_FORM_FIELDS.flatRate.flatRateFee.labelKey)}
              placeholder={t(REMUNERATION_FORM_FIELDS.flatRate.flatRateFee.placeholderKey)}
            />
          </FieldGroup>
        )}
      </Box>
    </Paper>
  );
};
