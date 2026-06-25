import { Card } from '@mantine/core';
import { Driver } from '../drivers-types';

interface DriverCardProps {
  driver: Driver;
}

export const DriverCard = ({ driver }: DriverCardProps) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      withBorder
      miw={300}
      mih={100}
    >
      {driver.firstName} {driver.lastName}
    </Card>
  );
};
