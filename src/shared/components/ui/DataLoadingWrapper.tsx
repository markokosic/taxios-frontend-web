import { ReactNode } from 'react';
import { Skeleton, Text } from '@mantine/core';

type DataLoadingWrapperProps = {
  isLoading: boolean;
  error?: Error | null;
  isEmpty: boolean;
  skeleton?: ReactNode;
  emptyFallback?: ReactNode;
  errorFallback?: ReactNode;
  children: ReactNode;
};

export const DataLoadingWrapper = ({
  isLoading,
  error,
  isEmpty,
  skeleton = <Skeleton height={200} radius="md" />,
  emptyFallback = <Text>No data available.</Text>,
  errorFallback,
  children,
}: DataLoadingWrapperProps) => {
  if (isLoading) {
    return <>{skeleton}</>;
  }
  if (error) {
    return <>{errorFallback || <Text c="red">{error.message}</Text>}</>;
  }
  if (isEmpty) {
    return <>{emptyFallback}</>;
  }
  return <>{children}</>;
};
