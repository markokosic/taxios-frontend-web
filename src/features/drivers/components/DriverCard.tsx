import { Card } from '@mantine/core';
import { DriverResponse } from '@/api/generated/model';

interface DriverCardProps {
  driver: DriverResponse;
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
