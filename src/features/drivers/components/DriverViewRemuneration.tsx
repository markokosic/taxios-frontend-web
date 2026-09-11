import { Badge, Card, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { Coins, Percent, Receipt, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DriverResponse } from '@/api/generated/model';
import { createFormatters } from '@/shared/utils';
import { RemunerationModelType } from '../domain/remuneration-types';
import { useRemunerationLabels } from '../hooks/useRemunerationLabels';

interface DriverViewRemunerationProps {
  driver: DriverResponse;
}

export const DriverViewRemuneration = ({ driver }: DriverViewRemunerationProps) => {
  const { t, i18n } = useTranslation(['app', 'common']);
  const fmt = createFormatters(i18n.language);
  const { getRemunerationLabel } = useRemunerationLabels();

  const configs = driver.currentRemunerationConfigs || [];

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
          {t('app:remuneration.driver_remuneration')}
        </Text>
      </Group>

      <Divider mb="lg" />

      {configs.length === 0 ? (
        <Text c="dimmed" size="sm">
          {t('app:dashboard.charts.empty.general')}
        </Text>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing="xl"
        >
          {configs.map((config, index) => {
            const type = config.remunerationModelType as RemunerationModelType;
            const typeLabel = getRemunerationLabel(type);

            return (
              <Card
                key={index}
                withBorder
                radius="md"
                p="md"
                bg="var(--mantine-color-gray-0)"
              >
                <Stack gap="xs">
                  <Group justify="space-between" align="center">
                    <Badge
                      color="indigo"
                      variant="filled"
                      size="sm"
                    >
                      {typeLabel}
                    </Badge>
                  </Group>

                  {type === RemunerationModelType.PERCENTAGE_SHARE && (
                    <>
                      {'driverRevenueSharePercentage' in config && (
                        <Group gap="xs" c="dimmed">
                          <Percent size={16} />
                          <Text size="sm">
                            {t('common:form.driverRevenueSharePercentage.label')}:
                          </Text>
                          <Text fw={600} size="sm" c="dark">
                            {config.driverRevenueSharePercentage !== undefined &&
                            config.driverRevenueSharePercentage !== null
                              ? `${(config.driverRevenueSharePercentage * 100).toFixed(2).replace(/\.?0+$/, '')} %`
                              : '-'}
                          </Text>
                        </Group>
                      )}
                      {'minDriverPayoutPerShift' in config && config.minDriverPayoutPerShift != null && (
                        <Group gap="xs" c="dimmed">
                          <Coins size={16} />
                          <Text size="sm">
                            {t('common:form.minDriverPayoutPerShift.label')}:
                          </Text>
                          <Text fw={600} size="sm" c="dark">
                            {fmt.number(config.minDriverPayoutPerShift)} €
                          </Text>
                        </Group>
                      )}
                    </>
                  )}

                  {type === RemunerationModelType.FLAT_RATE && (
                    <>
                      {'flatRateTypeName' in config && config.flatRateTypeName && (
                        <Group gap="xs" c="dimmed">
                          <Tag size={16} />
                          <Text size="sm">
                            {t('common:form.flatRateTypeId.label')}:
                          </Text>
                          <Text fw={600} size="sm" c="dark">
                            {config.flatRateTypeName}
                          </Text>
                        </Group>
                      )}
                      {'driverFlatRatePayoutPerShift' in config && config.driverFlatRatePayoutPerShift != null && (
                        <Group gap="xs" c="dimmed">
                          <Coins size={16} />
                          <Text size="sm">
                            {t('common:form.driverFlatRatePayoutPerShift.label')}:
                          </Text>
                          <Text fw={600} size="sm" c="dark">
                            {fmt.number(config.driverFlatRatePayoutPerShift)} €
                          </Text>
                        </Group>
                      )}
                    </>
                  )}

                  {type === RemunerationModelType.WEEKLY_FIXED_RATE && (
                    <>
                      {'weeklyFixedCompanySettlement' in config && config.weeklyFixedCompanySettlement != null && (
                        <Group gap="xs" c="dimmed">
                          <Coins size={16} />
                          <Text size="sm">
                            {t('common:form.weeklyFixedCompanySettlement.label')}:
                          </Text>
                          <Text fw={600} size="sm" c="dark">
                            {fmt.number(config.weeklyFixedCompanySettlement)} €
                          </Text>
                        </Group>
                      )}
                      {'settlementDay' in config && (
                        <Group gap="xs" c="dimmed">
                          <Receipt size={16} />
                          <Text size="sm">
                            {t('common:form.settlementDay.label')}:
                          </Text>
                          <Text fw={600} size="sm" c="dark">
                            {config.settlementDay}
                          </Text>
                        </Group>
                      )}
                    </>
                  )}
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Card>
  );
};
