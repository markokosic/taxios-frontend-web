import { X } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { useGetActiveFlatRateTypes } from '@/api/generated/endpoints/flat-rate-types/flat-rate-types';
import i18n from '@/lib/i18n/i18n';
import { createFormatters, getNumberSeparators } from '@/shared/utils';
import { RemunerationModelType } from '../domain/remuneration-types';
import {
  RemunerationConfigFormValue,
  useRemunerationConfigs,
} from '../hooks/useRemunerationConfigs';

const isFlatRateShare = (config: RemunerationConfigFormValue) =>
  config.remunerationModelType === RemunerationModelType.FLAT_RATE_PERCENTAGE;

type ShareValue = number | string;

const toShare = (value: ShareValue): number | null =>
  value === '' || Number.isNaN(Number(value)) ? null : Number(value);

export const DriverFlatRatesSection = () => {
  const { t } = useTranslation(['common', 'app']);
  const fmt = createFormatters(i18n.language);
  const { decimalSeparator } = getNumberSeparators(i18n.language);
  const { control, setValue } = useFormContext();
  const { configs, setConfigs } = useRemunerationConfigs();
  const { data: flatRateTypesResponse } = useGetActiveFlatRateTypes();

  const allowedIds = (useWatch({ control, name: 'allowedFlatRateTypeIds' }) ?? []) as number[];
  const flatRateTypes = (flatRateTypesResponse?.data ?? []).filter(
    (type) => type.id !== undefined && type.id !== null
  );

  const keepsFullRevenue = configs.some(
    (c) => c.remunerationModelType === RemunerationModelType.WEEKLY_FIXED_RATE
  );
  const defaultShare = configs.find((c) => isFlatRateShare(c) && c.flatRateTypeId == null);
  const findOverride = (typeId: number) =>
    configs.find((c) => isFlatRateShare(c) && c.flatRateTypeId === typeId);

  /** Sets, changes or (with null) removes the share of one flat ride, or of all rides for typeId null. */
  const upsertShare = (typeId: number | null, value: number | null) => {
    const matches = (c: RemunerationConfigFormValue) =>
      isFlatRateShare(c) && (c.flatRateTypeId ?? null) === typeId;
    const exists = configs.some(matches);

    if (value === null) {
      setConfigs(configs.filter((c) => !matches(c)));
    } else if (exists) {
      setConfigs(configs.map((c) => (matches(c) ? { ...c, driverSharePercentage: value } : c)));
    } else {
      setConfigs([
        ...configs,
        {
          remunerationModelType: RemunerationModelType.FLAT_RATE_PERCENTAGE,
          driverSharePercentage: value,
          flatRateTypeId: typeId,
        },
      ]);
    }
  };

  const toggleAllowed = (typeId: number, checked: boolean) => {
    const nextIds = checked ? [...allowedIds, typeId] : allowedIds.filter((id) => id !== typeId);
    setValue('allowedFlatRateTypeIds', nextIds, { shouldDirty: true, shouldValidate: true });
    // a custom share only makes sense for a flat ride the driver may drive
    if (!checked && findOverride(typeId)) {
      upsertShare(typeId, null);
    }
  };

  const shareInputProps = {
    min: 0,
    max: 100,
    clampBehavior: 'strict' as const,
    decimalScale: 2,
    decimalSeparator,
    suffix: ' %',
  };

  return (
    <Paper withBorder shadow="xs" p="lg" radius="md">
      <Stack gap="md">
        <Stack gap={2}>
          <Text fw={700} size="md">
            {t('app:remuneration.flat_rates.title')}
          </Text>
          <Text size="sm" c="dimmed">
            {t('app:remuneration.flat_rates.description')}
          </Text>
        </Stack>

        <NumberInput
          {...shareInputProps}
          maw={420}
          label={t('app:remuneration.flat_rates.default_share.label')}
          description={t('app:remuneration.flat_rates.default_share.description')}
          placeholder={t('app:remuneration.flat_rates.default_share.placeholder')}
          value={defaultShare?.driverSharePercentage ?? ''}
          onChange={(value) => upsertShare(null, toShare(value))}
        />

        {flatRateTypes.length === 0 ? (
          <Text size="sm" c="dimmed">
            {t('app:remuneration.flat_rates.no_flat_rates')}
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={560}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={90}>{t('app:remuneration.flat_rates.columns.allowed')}</Table.Th>
                  <Table.Th>{t('app:remuneration.flat_rates.columns.name')}</Table.Th>
                  <Table.Th>{t('app:remuneration.flat_rates.columns.price')}</Table.Th>
                  <Table.Th>{t('app:remuneration.flat_rates.columns.share')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {flatRateTypes.map((type) => {
                  const typeId = type.id as number;
                  const allowed = allowedIds.includes(typeId);
                  const override = findOverride(typeId);

                  return (
                    <Table.Tr key={typeId}>
                      <Table.Td>
                        <Checkbox
                          checked={allowed}
                          onChange={(event) => toggleAllowed(typeId, event.currentTarget.checked)}
                          aria-label={type.name}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500} c={allowed ? undefined : 'dimmed'}>
                          {type.name}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {type.defaultPrice != null ? `${fmt.number(type.defaultPrice)} €` : '-'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {!allowed ? (
                          <Text size="sm" c="dimmed">
                            –
                          </Text>
                        ) : override ? (
                          <Group gap="xs" wrap="nowrap">
                            <NumberInput
                              {...shareInputProps}
                              w={130}
                              size="xs"
                              aria-label={t('app:remuneration.flat_rates.columns.share')}
                              value={override.driverSharePercentage ?? ''}
                              onChange={(value) => upsertShare(typeId, toShare(value))}
                            />
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              size="sm"
                              aria-label={t('app:remuneration.flat_rates.use_default')}
                              title={t('app:remuneration.flat_rates.use_default')}
                              onClick={() => upsertShare(typeId, null)}
                            >
                              <X size={14} />
                            </ActionIcon>
                          </Group>
                        ) : (
                          <Group gap="xs" wrap="nowrap">
                            <Text size="sm">
                              {defaultShare?.driverSharePercentage != null
                                ? t('app:remuneration.flat_rates.default_value', {
                                    value: defaultShare.driverSharePercentage,
                                  })
                                : t(
                                    keepsFullRevenue
                                      ? 'app:remuneration.flat_rates.keeps_all'
                                      : 'app:remuneration.flat_rates.no_share'
                                  )}
                            </Text>
                            <Button
                              variant="subtle"
                              size="compact-xs"
                              onClick={() =>
                                upsertShare(typeId, defaultShare?.driverSharePercentage ?? 0)
                              }
                            >
                              {t('app:remuneration.flat_rates.customize')}
                            </Button>
                          </Group>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Stack>
    </Paper>
  );
};
