import { Box, Flex, Stack } from '@mantine/core';
import { useGetAllCars } from '@/api/generated/endpoints/cars/cars';
import { CarResponse, PageResponseCarResponse } from '@/api/generated/model';
import { AppLink } from '@/shared/components/ui/AppLink';
import { AppPagination } from '@/shared/components/ui/AppPagination';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { ROUTES } from '@/config/routes';
import { usePagination } from '@/shared/hooks/usePagination';
import { CarCard } from './CarCard';
import { CarCardSkeleton } from './CarCardSkeleton';

export const CarsList = () => {
  const { page, pageable, setPage } = usePagination({ defaultSize: 25 });
  const {
    data: paginationData,
    isLoading,
    error,
  } = useGetAllCars<PageResponseCarResponse>(
    { ...pageable },
    {
      query: {
        select: (response) => response.data!,
      },
    }
  );

  const cars = paginationData?.content || [];
  const isEmpty =
    !isLoading && (!paginationData?.totalElements || paginationData.totalElements === 0);

  return (
    <Stack
      style={{ height: '100%', overflow: 'hidden' }}
      gap="xs"
    >
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          paddingRight: 6,
          paddingBottom: 8,
        }}
      >
        <DataLoadingWrapper
          isLoading={isLoading}
          error={error as Error | null}
          isEmpty={isEmpty}
          skeleton={<CarCardSkeleton />}
        >
          {cars.length > 0 && (
            <Flex
              gap={24}
              wrap="wrap"
              align="stretch"
            >
              {cars.map((car: CarResponse) => (
                <AppLink
                  key={car.id}
                  to={`${ROUTES.app.cars.view.getHref(car.id!)}`}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <CarCard car={car} />
                </AppLink>
              ))}
            </Flex>
          )}
        </DataLoadingWrapper>
      </Box>

      <AppPagination
        page={page}
        totalPages={paginationData?.totalPages}
        onChange={setPage}
      />
    </Stack>
  );
};
