import { Flex } from '@mantine/core';
import { AppLink } from '@/components/ui/AppLink';
import { DataLoadingWrapper } from '@/components/ui/DataLoadingWrapper';
import { ROUTES } from '@/config/routes';
import { Car } from '../cars-types';
import { useGetCars } from '../hooks/useGetCars';
import { CarCard } from './CarCard';
import { CarCardSkeleton } from './CarCardSkeleton';

export const CarsList = () => {
  const { data, isLoading, error } = useGetCars();

  return (
    <DataLoadingWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={data?.totalElements === 0}
      skeleton={<CarCardSkeleton />}
    >
      {data?.content && data.totalElements > 0 && (
        <Flex
          gap={24}
          wrap="wrap"
        >
          {data.content.map((car: Car) => (
            <AppLink
              key={car.id}
              to={`${ROUTES.app.cars.view.getHref(car.id)}`}
            >
              <CarCard car={car} />
            </AppLink>
          ))}
        </Flex>
      )}
    </DataLoadingWrapper>
  );
};
