import { Card, Group, Stack, Text, Badge, ActionIcon } from '@mantine/core';
import { Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FuelStationRecommendationResponse } from '@/api/generated/model';

interface FuelStationCardProps {
  station: FuelStationRecommendationResponse;
}

export const FuelStationCard = ({ station }: FuelStationCardProps) => {
  const { t } = useTranslation(['app']);

  return (
    <Card withBorder padding="sm" radius="md" shadow="none">
      <Group wrap="nowrap" align="center" gap="sm">
        <Stack gap={4} style={{ flex: 1 }}>
          <Text fw={600} size="sm" lineClamp={1}>{station.name}</Text>
          <Text size="xs" c="dimmed" lineClamp={1}>{station.address}</Text>
          
          <Group gap={6} mt={2}>
            <Badge color="blue" variant="light" size="sm">
              {station.distanceKm?.toFixed(1)} km
            </Badge>
            <Badge color="green" variant="light" size="sm">
              {station.pricePerLiter?.toFixed(3)} €/L
            </Badge>
          </Group>
          
          <Text size="sm" fw={700} mt={2}>
            {t('app:fuel.total', { total: station.calculatedCost?.totalEur?.toFixed(2) })}
            <Text component="span" size="xs" c="dimmed" fw={400}>
              {' '} ({station.calculatedCost?.refuelTotalEur?.toFixed(2)}€ + {station.calculatedCost?.tripCostEur?.toFixed(2)}€)
            </Text>
          </Text>
        </Stack>

        <ActionIcon 
          component="a" 
          href={station.googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          variant="light"
          color="blue"
          size="xl"
          radius="md"
          title={t('app:fuel.navigate')}
        >
          <Navigation size={22} />
        </ActionIcon>
      </Group>
    </Card>
  );
};
