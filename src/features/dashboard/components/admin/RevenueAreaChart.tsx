import { useTranslation } from 'react-i18next';
import { AreaChart } from '@mantine/charts';
import { Box, Center, Paper, Stack, Text, Title } from '@mantine/core';

export interface RevenueAreaChartProps {
  data: Array<{
    date: string;
    revenue: number;
    companyRemuneration?: number;
    driverRemuneration?: number;
  }>;
  title?: string;
  subtitle?: string;
  height?: number;
}

export const RevenueAreaChart = ({
  data,
  title,
  subtitle,
  height = 300,
}: RevenueAreaChartProps) => {
  const { t, i18n } = useTranslation(['app']);

  const chartTitle = title || t('app:dashboard.charts.revenue_timeline_title');

  const series = [
    { name: 'revenue', label: t('app:dashboard.charts.series.revenue'), color: 'blue.6' },
    { name: 'companyRemuneration', label: t('app:dashboard.charts.series.company_share'), color: 'teal.6' },
    { name: 'driverRemuneration', label: t('app:dashboard.charts.series.driver_share'), color: 'violet.6' },
  ];

  const isEmpty = !data || data.length === 0;

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
      <Stack gap="xs" mb="md">
        <Title order={4}>{chartTitle}</Title>
        {subtitle && (
          <Text size="xs" c="dimmed">
            {subtitle}
          </Text>
        )}
      </Stack>

      <Box style={{ width: '100%', minWidth: 0, flex: 1 }}>
        {isEmpty ? (
          <Center h={height}>
            <Text size="sm" c="dimmed">
              {t('app:dashboard.charts.empty.revenue')}
            </Text>
          </Center>
        ) : (
          <AreaChart
            h={height}
            data={data}
            dataKey="date"
            series={series}
            curveType="monotone"
            withLegend
            legendProps={{ verticalAlign: 'bottom', height: 40 }}
            gridAxis="xy"
            strokeWidth={2}
            dotProps={{ r: 3, strokeWidth: 1 }}
            activeDotProps={{ r: 6, strokeWidth: 0 }}
            valueFormatter={(val) => `${val.toLocaleString(i18n.language || 'de-DE')} €`}
          />
        )}
      </Box>
    </Paper>
  );
};
