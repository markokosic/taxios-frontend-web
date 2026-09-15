import { Box, Flex, Stack } from '@mantine/core';
import { useGetAllUsers } from '@/api/generated/endpoints/users/users';
import { UserResponse } from '@/api/generated/model';
import { AppPagination } from '@/shared/components/ui/AppPagination';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { usePagination } from '@/shared/hooks/usePagination';
import { UserCard } from './UserCard';
import { UserCardSkeleton } from './UserCardSkeleton';

export const UsersList = () => {
  const { page, pageable, setPage } = usePagination({ defaultSize: 25 });
  const { data: response, isPending: isLoading, error } = useGetAllUsers({ ...pageable });

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
          skeleton={<UserCardSkeleton />}
        >
          {content && (
            <Flex
              gap={24}
              wrap="wrap"
              align="stretch"
            >
              {content.map((user: UserResponse) => (
                <UserCard
                  key={user.id}
                  user={user}
                />
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
