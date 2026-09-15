import { Box, Flex, Stack } from '@mantine/core';
import { useGetAllDrivers } from '@/api/generated/endpoints/drivers/drivers';
import { DriverResponse } from '@/api/generated/model';
import { AppLink } from '@/shared/components/ui/AppLink';
import { AppPagination } from '@/shared/components/ui/AppPagination';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { ROUTES } from '@/config/routes';
import { usePagination } from '@/shared/hooks/usePagination';
import { DriverCard } from './DriverCard';
import { DriverCardSkeleton } from './DriverCardSkeleton';

export const DriversList = () => {
  const { page, pageable, setPage } = usePagination({ defaultSize: 25 });
  const { data: response, isPending: isLoading, error } = useGetAllDrivers({ ...pageable });

  const pageData = response?.data;
  const content = pageData?.content ?? [];
  const totalElements = pageData?.totalElements ?? 0;

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
          error={error}
          isEmpty={!isLoading && totalElements === 0}
          skeleton={<DriverCardSkeleton />}
        >
          {content && (
            <Flex
              gap={24}
              wrap="wrap"
              align="stretch"
            >
              {content.map((driver: DriverResponse) => (
                <AppLink
                  key={driver.id}
                  to={`${ROUTES.app.drivers.view.getHref(driver.id)}`}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <DriverCard driver={driver} />
                </AppLink>
              ))}
            </Flex>
          )}
        </DataLoadingWrapper>
      </Box>

      <Box style={{ flexShrink: 0 }}>
        <AppPagination
          page={page}
          totalPages={pageData?.totalPages}
          onChange={setPage}
        />
      </Box>
    </Stack>
  );
};
