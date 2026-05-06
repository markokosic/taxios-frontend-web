import { Card, Flex, Skeleton } from '@mantine/core';

export const CarCardSkeleton = () => {
  const skeletons = Array.from({ length: 6 });

  return (
    <Flex gap="md" wrap="wrap">
      {skeletons.map((_, index) => (
        <Card
          key={index}
          shadow="sm"
          padding="lg"
          radius="md"
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
            width="30%"
          />
        </Card>
      ))}
    </Flex>
  );
};
