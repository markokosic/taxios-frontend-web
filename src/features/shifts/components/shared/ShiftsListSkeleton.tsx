import { Skeleton, Stack } from '@mantine/core';

export const ShiftsListSkeleton = () => {
  return (
    <Stack gap="sm">
      <Skeleton height={50} radius="md" />
      <Skeleton height={50} radius="md" />
      <Skeleton height={50} radius="md" />
      <Skeleton height={50} radius="md" />
      <Skeleton height={50} radius="md" />
    </Stack>
  );
};
