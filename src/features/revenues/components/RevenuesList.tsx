import { useTranslation } from 'react-i18next';
import { Paper, Text, Group, Stack, Badge, Grid, Button, ThemeIcon, Skeleton, Box } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Edit2, User, Car as CarIcon, Calendar, ArrowRight, Clock, Route, DollarSign, Briefcase } from 'lucide-react';
import { useGetDrivers } from '@/features/drivers/hooks/useGetDrivers';
import { useGetCars } from '@/features/cars/hooks/useGetCars';
import { RemunerationModelType } from '@/features/remuneration/remuneration-types';
import { RevenueEditForm } from './RevenueEditForm';

interface RevenuesListProps {
  revenues: any[];
}

export const RevenuesList = ({ revenues }: RevenuesListProps) => {
  const { t } = useTranslation(['revenues', 'common']);
  const { data: driversData, isLoading: isLoadingDrivers } = useGetDrivers();
  const { data: carsData, isLoading: isLoadingCars } = useGetCars();

  const drivers = driversData?.content ?? [];
  const cars = carsData?.content ?? [];

  const i18nDriverRemunerationConfigMap: Record<RemunerationModelType, string> = {
    [RemunerationModelType.PERCENTAGE_SHARE]: 'percentageShare',
    [RemunerationModelType.WEEKLY_FIXED_RATE]: 'weeklyFixedRate',
    [RemunerationModelType.FLAT_RATE]: 'flatRate',
  };

  const getRemunerationLabel = (type: RemunerationModelType) => {
    const key = i18nDriverRemunerationConfigMap[type];
    return key ? t(`remuneration:type.${key}`) : type;
  };

  const handleEdit = (revenue: any) => {
    const modalId = modals.open({
      title: t('common:actions.edit'),
      size: 'xl',
      children: (
        <RevenueEditForm
          revenue={revenue}
          drivers={drivers}
          cars={cars}
          onCancel={() => modals.close(modalId)}
          onSuccess={() => modals.close(modalId)}
        />
      ),
    });
  };

  if (isLoadingDrivers || isLoadingCars) {
    return (
      <Stack gap="md">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Paper key={idx} p="md" withBorder radius="md">
            <Skeleton height={20} width="40%" mb="sm" />
            <Skeleton height={50} mb="sm" />
            <Skeleton height={20} width="20%" />
          </Paper>
        ))}
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {revenues.map((item) => {
        const isFlatRate = item.remunerationModelType === RemunerationModelType.FLAT_RATE;
        const carLabel = item.carLicensePlate 
          ? `${item.carLicensePlate} (${item.carBrand || ''} ${item.carModel || ''})`
          : t('common:car');

        return (
          <Paper
            key={item.id}
            p="md"
            withBorder
            radius="md"
            style={{
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            className="hover:shadow-md hover:translate-y-[-2px]"
          >
            <Grid gutter="md" align="center">
              {/* Left Column: Driver, Date and Car */}
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="xs">
                  <Group gap="xs">
                    <ThemeIcon color="blue" variant="light" size="sm">
                      <User size={14} />
                    </ThemeIcon>
                    <Text fw={600} size="md">
                      {item.driverFirstName} {item.driverLastName}
                    </Text>
                  </Group>

                  <Group gap="xs" c="dimmed" size="xs">
                    <ThemeIcon color="gray" variant="light" size="sm">
                      <Calendar size={12} />
                    </ThemeIcon>
                    <Text size="sm">
                      {item.date}
                    </Text>
                  </Group>

                  <Group gap="xs" c="dimmed" size="xs">
                    <ThemeIcon color="gray" variant="light" size="sm">
                      <CarIcon size={12} />
                    </ThemeIcon>
                    <Text size="sm" style={{ wordBreak: 'break-all' }}>
                      {carLabel}
                    </Text>
                  </Group>
                </Stack>
              </Grid.Col>

              {/* Middle Column: Route, Times & Logical Fields */}
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Grid gutter="xs">
                  <Grid.Col span={6}>
                    <Stack gap="2px">
                      <Group gap="4px" c="dimmed">
                        <Route size={14} />
                        <Text size="xs" fw={500}>{t('revenues:fields.kilometers_driven')}</Text>
                      </Group>
                      <Text size="sm" fw={600}>
                        {item.kilometersDriven} km
                      </Text>
                      <Text size="xs" c="dimmed">
                        {item.kilometersFrom} km <ArrowRight size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {item.kilometersTo} km
                      </Text>
                    </Stack>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Stack gap="2px">
                      <Group gap="4px" c="dimmed">
                        <Clock size={14} />
                        <Text size="xs" fw={500}>{t('revenues:sections.route_and_times')}</Text>
                      </Group>
                      <Text size="sm" fw={600}>
                        {item.drivingStartTime && item.drivingEndTime 
                          ? `${item.drivingStartTime.substring(0, 5)} - ${item.drivingEndTime.substring(0, 5)}`
                          : '-'}
                      </Text>
                    </Stack>
                  </Grid.Col>

                  {/* Logical Fields shown conditionally if FLAT_RATE */}
                  {isFlatRate && (
                    <>
                      <Grid.Col span={6}>
                        <Stack gap="2px">
                          <Text size="xs" c="dimmed" fw={500}>{t('revenues:fields.trip_count')}</Text>
                          <Text size="sm" fw={600}>
                            {item.tripCount ?? 0}
                          </Text>
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Stack gap="2px">
                          <Text size="xs" c="dimmed" fw={500}>{t('revenues:fields.price_per_trip')}</Text>
                          <Text size="sm" fw={600}>
                            {item.pricePerTrip != null ? `${item.pricePerTrip.toFixed(2)} €` : '-'}
                          </Text>
                        </Stack>
                      </Grid.Col>
                    </>
                  )}
                </Grid>
              </Grid.Col>

              {/* Right Column: Financial details and Edit button */}
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Stack gap="xs" align="flex-end" justify="center" style={{ width: '100%' }}>
                  <Badge color="teal" size="lg" variant="light" py="md">
                    <Group gap="xs">
                      <DollarSign size={14} />
                      <Text fw={700}>
                        {item.revenue.toFixed(2)} €
                      </Text>
                    </Group>
                  </Badge>

                  <Stack gap="2px" align="flex-end" style={{ width: '100%' }}>
                    <Group gap="xs" justify="space-between" style={{ width: '100%', maxWidth: '200px' }}>
                      <Text size="xs" c="dimmed">{t('common:driver')}:</Text>
                      <Text size="xs" fw={600} c="blue">
                        {item.driverRemuneration.toFixed(2)} €
                      </Text>
                    </Group>
                    <Group gap="xs" justify="space-between" style={{ width: '100%', maxWidth: '200px' }}>
                      <Text size="xs" c="dimmed">{t('revenues:fields.weekly_company_share')}:</Text>
                      <Text size="xs" fw={600} c="grape">
                        {item.companyRemuneration.toFixed(2)} €
                      </Text>
                    </Group>
                  </Stack>

                  <Group gap="xs">
                    <Badge variant="outline" color="indigo" size="sm">
                      {getRemunerationLabel(item.remunerationModelType)}
                    </Badge>
                    
                    <Button
                      variant="subtle"
                      color="blue"
                      size="xs"
                      leftSection={<Edit2 size={12} />}
                      onClick={() => handleEdit(item)}
                    >
                      {t('common:actions.edit')}
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>
        );
      })}
    </Stack>
  );
};
