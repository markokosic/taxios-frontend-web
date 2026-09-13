import { useState, useCallback } from 'react';
import { Card, Stack, Text, Title, Button, Group, NumberInput, Select, Alert, SimpleGrid } from '@mantine/core';
import { MapPin, Fuel } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetRecommendations } from '@/api/generated/endpoints/fuel-station/fuel-station';
import { useGeolocation } from '@/hooks/useGeolocation';
import { FuelStationCard } from './FuelStationCard';

export const FuelStationRecommendations = () => {
  const { t } = useTranslation(['app']);
  const [fuelType, setFuelType] = useState<string>('SUP');
  const [tankAmount, setTankAmount] = useState<number | string>(30);
  
  const { location, error: locationError, setError: setLocationError, requestLocation } = useGeolocation();

  const { data: response, isFetching, isError } = useGetRecommendations(
    { lat: location?.lat || 0, lng: location?.lng || 0, fuelType, tankAmount: Number(tankAmount) },
    { query: { enabled: !!location } }
  );

  const stations = response?.data;

  const handleGetLocation = useCallback(() => {
    requestLocation(
      () => setLocationError(t('app:fuel.errors.permission_denied')),
      () => setLocationError(t('app:fuel.errors.no_geolocation'))
    );
  }, [requestLocation, setLocationError, t]);

  return (
    <Card withBorder radius="md" p="md" mt="md">
      <Stack gap="md">
        <Group align="center" gap="xs">
          <Fuel size={20} />
          <Title order={3} size="h5">{t('app:fuel.widget_title')}</Title>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
          <Select
            label={t('app:fuel.fuel_type')}
            value={fuelType}
            onChange={(v) => setFuelType(v || 'SUP')}
            data={[
              { value: 'SUP', label: t('app:fuel.fuel_types.SUP') },
              { value: 'DIE', label: t('app:fuel.fuel_types.DIE') }
            ]}
          />
          <NumberInput
            label={t('app:fuel.amount_liters')}
            value={tankAmount}
            onChange={(v) => setTankAmount(v)}
            min={1}
            max={150}
          />
        </SimpleGrid>

        <Button 
          leftSection={<MapPin size={18} />} 
          onClick={handleGetLocation}
          loading={isFetching}
          fullWidth
        >
          {t('app:fuel.search')}
        </Button>

        {locationError && (
          <Alert color="red" p="xs">
            {locationError}
          </Alert>
        )}

        {isError && (
          <Alert color="red" p="xs">
            {t('app:fuel.errors.api_error')}
          </Alert>
        )}

        {stations && stations.length === 0 && (
          <Text c="dimmed" ta="center" size="sm" mt="xs">{t('app:fuel.no_results')}</Text>
        )}

        {stations && stations.length > 0 && (
          <Stack gap="xs" mt="xs">
            {stations.slice(0, 3).map((station) => (
              <FuelStationCard key={station.id} station={station} />
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
