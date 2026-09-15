import { Badge } from '@mantine/core';
import { ShiftResponseStatus } from '@/api/generated/model';

interface ShiftStatusBadgeProps {
  status?: ShiftResponseStatus | string | null;
}

export const ShiftStatusBadge = ({ status }: ShiftStatusBadgeProps) => {
  const color =
    status === ShiftResponseStatus.APPROVED
      ? 'green'
      : status === ShiftResponseStatus.PENDING
        ? 'yellow'
        : 'red';

  return (
    <Badge color={color} variant="light">
      {status || '-'}
    </Badge>
  );
};
