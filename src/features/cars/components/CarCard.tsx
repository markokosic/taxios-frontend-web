import { Card, Text } from '@mantine/core';
import { Car } from '@/api/generated/model/car';

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      withBorder
      miw={300}
      mih={100}
    >
      <Text fw={500}>{car.brand} {car.model}</Text>
      <Text size="sm" c="dimmed">{car.licensePlate}</Text>
    </Card>
  );
};
