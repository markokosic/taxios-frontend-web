import { Card, Flex, Skeleton, Stack } from '@mantine/core';

export const UserCardSkeleton = () => {
  const skeletons = Array.from({ length: 6 });

  return (
    <Flex
      gap={24}
      wrap="wrap"
    >
      {skeletons.map((_, index) => (
        <Card
          key={index}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          w={{ base: '100%', sm: 320 }}
        >
          <Stack gap="xs">
            <Skeleton
              height={20}
              width="30%"
              mb="xs"
            />
            <Skeleton
              height={18}
              width="70%"
            />
            <Skeleton
              height={14}
              width="85%"
            />
            <Skeleton
              height={20}
              width="40%"
              mt="xs"
            />
          </Stack>
        </Card>
      ))}
    </Flex>
  );
};
