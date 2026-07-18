import { Flex } from '@mantine/core';
import { AppLink } from '@/components/ui/AppLink';
import { DataLoadingWrapper } from '@/components/ui/DataLoadingWrapper';
import { ROUTES } from '@/config/routes';
import { useGetAllDrivers } from '@/api/generated/endpoints/drivers/drivers';
import { DriverCard } from './DriverCard';
import { DriverCardSkeleton } from './DriverCardSkeleton';
import { DriverResponse } from '@/api/generated/model';

export const DriversList = () => {
  const { data: response, isPending: isLoading, error } = useGetAllDrivers({pageable:{}});

  const pageData = response?.data;

  if (isLoading || !pageData) {
    return null;
  }

  const { totalElements, content } = pageData;

  return (
    <DataLoadingWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={totalElements === 0}
      skeleton={<DriverCardSkeleton />}
    >
      {content  && (
        <Flex
          gap={24}
          wrap="wrap"
        >
          {content.map((driver: DriverResponse) => (
            <AppLink
              key={driver.id}
              to={`${ROUTES.app.drivers.view.getHref(driver.id)}`}
            >
              <DriverCard driver={driver} />
            </AppLink>
          ))}
        </Flex>
      )}
    </DataLoadingWrapper>
  );
};
