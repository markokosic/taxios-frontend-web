import { Group, Pagination } from '@mantine/core';

export interface AppPaginationProps {
  page: number;
  totalPages?: number;
  onChange: (page: number) => void;
}

export const AppPagination = ({ page, totalPages, onChange }: AppPaginationProps) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <Group
      justify="center"
      py="sm"
    >
      <Pagination
        value={page}
        onChange={onChange}
        total={totalPages}
        withEdges
      />
    </Group>
  );
};
