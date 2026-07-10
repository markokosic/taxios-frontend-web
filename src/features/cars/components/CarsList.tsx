import { Flex } from '@mantine/core';
import { useGetAllCars } from '@/api/generated/endpoints/cars/cars';
import { Car, PageCar } from '@/api/generated/model';
import { AppLink } from '@/components/ui/AppLink';
import { DataLoadingWrapper } from '@/components/ui/DataLoadingWrapper';
import { ROUTES } from '@/config/routes';
import { CarCard } from './CarCard';
import { CarCardSkeleton } from './CarCardSkeleton';

export const CarsList = () => {
  const { data: paginationData, isLoading, error } = useGetAllCars<PageCar>(
    { pageable: {} },
    {
      query: {
        select: (response) => response.data!,
      },
    }
  );

  const cars = paginationData?.content || [];
  const isEmpty = !paginationData?.totalElements || paginationData.totalElements === 0;

  return (
    <DataLoadingWrapper
      isLoading={isLoading}
      error={error as any}
      isEmpty={isEmpty}
      skeleton={<CarCardSkeleton />}
    >
      {cars.length > 0 && (
        <Flex
          gap={24}
          wrap="wrap"
        >
          {cars.map((car: Car) => (
            <AppLink
              key={car.id}
              to={`${ROUTES.app.cars.view.getHref(car.id!)}`}
            >
              <CarCard car={car} />
            </AppLink>
          ))}
        </Flex>
      )}
    </DataLoadingWrapper>
  );
};
