import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Card, Checkbox, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { ControlledCombobox } from '@/shared/components/forms/ControlledCombobox';
import { ControlledNumberInput } from '@/shared/components/forms/ControlledNumberInput';
import { DAYS_OF_THE_WEEK } from '@/shared/constants';
import { REMUNERATION_FORM_FIELDS } from '../domain/remuneration-form-fields';
import {
  areRemunerationModelsCompatible,
  isBaseRemunerationModel,
} from '../domain/remuneration-rules';
import { RemunerationModelType } from '../domain/remuneration-types';
import { useRemunerationLabels } from '../hooks/useRemunerationLabels';
import { useRemunerationConfigs } from '../hooks/useRemunerationConfigs';

const BASE_MODELS = [
  RemunerationModelType.PERCENTAGE_SHARE,
  RemunerationModelType.FIXED_PER_SHIFT,
  RemunerationModelType.WEEKLY_FIXED_RATE,
].filter(isBaseRemunerationModel);

const DESCRIPTION_KEYS: Partial<Record<RemunerationModelType, string>> = {
  [RemunerationModelType.PERCENTAGE_SHARE]: 'app:remuneration.base.description.percentageShare',
  [RemunerationModelType.FIXED_PER_SHIFT]: 'app:remuneration.base.description.fixedPerShift',
  [RemunerationModelType.WEEKLY_FIXED_RATE]: 'app:remuneration.base.description.weeklyFixedRate',
};

export const DriverBaseRemunerationSection = () => {
  const { t } = useTranslation(['common', 'app']);
  const { getRemunerationLabel } = useRemunerationLabels();
  const { configs, setConfigs } = useRemunerationConfigs();
  const {
    formState: { errors },
  } = useFormContext();

  const dayOptions = DAYS_OF_THE_WEEK.map((day) => ({
    value: day.value,
    label: t(day.label),
  }));

  const activeTypes = configs.map((c) => c.remunerationModelType);
  const indexOf = (type: RemunerationModelType) =>
    configs.findIndex((c) => c.remunerationModelType === type);

  const toggle = (type: RemunerationModelType, checked: boolean) => {
    if (checked) {
      setConfigs([...configs, { remunerationModelType: type }]);
    } else {
      setConfigs(configs.filter((c) => c.remunerationModelType !== type));
    }
  };

  const blockedBy = (type: RemunerationModelType) =>
    BASE_MODELS.filter(
      (other) =>
        other !== type &&
        activeTypes.includes(other) &&
        !areRemunerationModelsCompatible(type, other)
    );

  const rootError =
    (errors.remunerationConfigs as { message?: string; root?: { message?: string } } | undefined)
      ?.message ??
    (errors.remunerationConfigs as { root?: { message?: string } } | undefined)?.root?.message;

  const renderFields = (type: RemunerationModelType) => {
    const prefix = `remunerationConfigs.${indexOf(type)}`;

    if (type === RemunerationModelType.PERCENTAGE_SHARE) {
      return (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <ControlledNumberInput
            min={0}
            max={100}
            clampBehavior="strict"
            suffix="%"
            name={`${prefix}.${REMUNERATION_FORM_FIELDS.percentageShare.driverRevenueSharePercentage.name}`}
            label={t(REMUNERATION_FORM_FIELDS.percentageShare.driverRevenueSharePercentage.labelKey)}
            placeholder={t(
              REMUNERATION_FORM_FIELDS.percentageShare.driverRevenueSharePercentage.placeholderKey
            )}
          />
          <ControlledNumberInput
            min={0}
            suffix="€"
            name={`${prefix}.${REMUNERATION_FORM_FIELDS.percentageShare.minDriverPayoutPerShift.name}`}
            label={t(REMUNERATION_FORM_FIELDS.percentageShare.minDriverPayoutPerShift.labelKey)}
            placeholder={t(REMUNERATION_FORM_FIELDS.percentageShare.minDriverPayoutPerShift.placeholderKey)}
          />
        </SimpleGrid>
      );
    }

    if (type === RemunerationModelType.FIXED_PER_SHIFT) {
      return (
        <ControlledNumberInput
          min={0}
          suffix="€"
          name={`${prefix}.${REMUNERATION_FORM_FIELDS.fixedPerShift.driverPayoutPerShift.name}`}
          label={t(REMUNERATION_FORM_FIELDS.fixedPerShift.driverPayoutPerShift.labelKey)}
          placeholder={t(REMUNERATION_FORM_FIELDS.fixedPerShift.driverPayoutPerShift.placeholderKey)}
        />
      );
    }

    return (
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <ControlledNumberInput
          min={0}
          suffix="€"
          name={`${prefix}.${REMUNERATION_FORM_FIELDS.weeklyFixedRate.weeklyFixedCompanySettlement.name}`}
          label={t(REMUNERATION_FORM_FIELDS.weeklyFixedRate.weeklyFixedCompanySettlement.labelKey)}
          placeholder={t(
            REMUNERATION_FORM_FIELDS.weeklyFixedRate.weeklyFixedCompanySettlement.placeholderKey
          )}
        />
        <ControlledCombobox
          name={`${prefix}.${REMUNERATION_FORM_FIELDS.weeklyFixedRate.settlementDay.name}`}
          label={t(REMUNERATION_FORM_FIELDS.weeklyFixedRate.settlementDay.labelKey)}
          placeholder={t(REMUNERATION_FORM_FIELDS.weeklyFixedRate.settlementDay.placeholderKey)}
          data={dayOptions}
        />
      </SimpleGrid>
    );
  };

  return (
    <Paper withBorder shadow="xs" p="lg" radius="md">
      <Stack gap="md">
        <Stack gap={2}>
          <Text fw={700} size="md">
            {t('app:remuneration.base.title')}
          </Text>
          <Text size="sm" c="dimmed">
            {t('app:remuneration.base.description.general')}
          </Text>
        </Stack>

        {rootError && (
          <Alert color="red" variant="light">
            {rootError}
          </Alert>
        )}

        <Stack gap="sm">
          {BASE_MODELS.map((type) => {
            const active = activeTypes.includes(type);
            const blockers = blockedBy(type);
            const disabled = !active && blockers.length > 0;

            return (
              <Card
                key={type}
                withBorder
                radius="md"
                p="md"
                style={{
                  opacity: disabled ? 0.55 : 1,
                  borderColor: active ? 'var(--mantine-primary-color-filled)' : undefined,
                }}
              >
                <Stack gap="sm">
                  <Checkbox
                    checked={active}
                    disabled={disabled}
                    onChange={(event) => toggle(type, event.currentTarget.checked)}
                    label={getRemunerationLabel(type)}
                    description={
                      disabled
                        ? t('app:remuneration.base.not_combinable', {
                            models: blockers.map((b) => getRemunerationLabel(b)).join(', '),
                          })
                        : t(DESCRIPTION_KEYS[type] ?? '')
                    }
                    styles={{ label: { fontWeight: 600 } }}
                  />
                  {active && renderFields(type)}
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
};
