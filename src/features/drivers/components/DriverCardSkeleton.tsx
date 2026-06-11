import { Card, Skeleton, Stack } from '@mantine/core';

export const DriverCardSkeleton = () => {
  const skeletons = Array.from({ length: 15 });

  //TODO ADAPT TO REAL CARD

  return (
    <Stack gap="md">
      {skeletons.map((_, index) => (
        <Card
          key={index}
          shadow="sm"
          padding="lg"
          withBorder
          miw={300}
          mih={100}
        >
          <Skeleton
            height={20}
            width="50%"
            mb="sm"
          />
          <Skeleton
            height={15}
            width="80%"
            mb="xs"
          />
          <Skeleton
            height={15}
            width="70%"
            mb="xs"
          />
          <Skeleton
            height={15}
            width="60%"
          />
        </Card>
      ))}
    </Stack>
  );
};
