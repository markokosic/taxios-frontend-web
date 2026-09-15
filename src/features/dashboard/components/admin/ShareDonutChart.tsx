import { useTranslation } from 'react-i18next';
import { DonutChart } from '@mantine/charts';
import { Badge, Box, Center, Group, Paper, Stack, Text, Title } from '@mantine/core';

export interface ShareDonutChartProps {
  companyShare: number;
  driverShare: number;
  totalRevenue?: number;
  title?: string;
  height?: number;
}

export const ShareDonutChart = ({
  companyShare,
  driverShare,
  totalRevenue,
  title,
  height = 240,
}: ShareDonutChartProps) => {
  const { t, i18n } = useTranslation(['app']);

  const chartTitle = title || t('app:dashboard.charts.monthly_share_title');
  
  const sumShares = companyShare + driverShare;
  const total = totalRevenue && totalRevenue >= sumShares ? totalRevenue : sumShares;
  const otherShare = Math.max(0, total - sumShares);
  const isEmpty = total <= 0;

  const companyPct = !isEmpty ? Math.round((companyShare / total) * 100) : 0;
  const driverPct = !isEmpty ? Math.round((driverShare / total) * 100) : 0;
  const hasOther = otherShare > 0.5;
  const otherPct = !isEmpty && hasOther ? 100 - companyPct - driverPct : 0;

  const chartData = [
    { name: t('app:dashboard.charts.series.company_share'), value: companyShare, color: 'teal.6' },
    { name: t('app:dashboard.charts.series.driver_share'), value: driverShare, color: 'violet.6' },
  ];

  if (hasOther) {
    chartData.push({
      name: t('app:dashboard.charts.series.other_share'),
      value: otherShare,
      color: 'gray.5',
    });
  }

  return (
    <Paper
      p="md"
      withBorder
      radius="md"
      shadow="xs"
      h="100%"
      w="100%"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}
    >
      <Stack gap="xs" mb="sm">
        <Title order={4}>{chartTitle}</Title>
        <Text size="xs" c="dimmed">
          {t('app:dashboard.charts.share_subtitle')}
        </Text>
      </Stack>

      <Box style={{ width: '100%', minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {isEmpty ? (
          <Center h={height}>
            <Text size="sm" c="dimmed">
              {t('app:dashboard.charts.empty.share')}
            </Text>
          </Center>
        ) : (
          <>
            <Group justify="center" my="auto">
              <DonutChart
                data={chartData}
                size={height}
                thickness={22}
                withTooltip
                tooltipDataSource="segment"
                chartLabel={`${total.toLocaleString(i18n.language || 'de-DE')} €`}
                valueFormatter={(val) => `${val.toLocaleString(i18n.language || 'de-DE')} €`}
              />
            </Group>

            <Group justify="space-around" mt="md" pt="xs" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
              <Group gap="xs">
                <Badge color="teal.6" variant="filled" size="sm" circle />
                <Text size="xs" fw={600}>
                  {t('app:dashboard.charts.series.company_label')}: {companyPct}%
                </Text>
              </Group>

              <Group gap="xs">
                <Badge color="violet.6" variant="filled" size="sm" circle />
                <Text size="xs" fw={600}>
                  {t('app:dashboard.charts.series.driver_label')}: {driverPct}%
                </Text>
              </Group>

              {hasOther && (
                <Group gap="xs">
                  <Badge color="gray.5" variant="filled" size="sm" circle />
                  <Text size="xs" fw={600}>
                    {t('app:dashboard.charts.series.other_label')}: {otherPct}%
                  </Text>
                </Group>
              )}
            </Group>
          </>
        )}
      </Box>
    </Paper>
  );
};
