import { Badge, type BadgeProps } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { UserResponseRoles } from '@/api/generated/model';

export interface UserRoleBadgeProps extends Omit<BadgeProps, 'children'> {
  role?: UserResponseRoles | string;
}

const ROLE_COLOR_MAP: Record<string, string> = {
  [UserResponseRoles.OWNER]: 'violet',
  [UserResponseRoles.ADMIN]: 'indigo',
  [UserResponseRoles.BACKOFFICE]: 'teal',
  [UserResponseRoles.DRIVER]: 'cyan',
};

export const UserRoleBadge = ({
  role,
  size = 'xs',
  variant = 'filled',
  radius = 'xl',
  ...badgeProps
}: UserRoleBadgeProps) => {
  const { t } = useTranslation('common');

  if (!role) {return null;}

  const color = ROLE_COLOR_MAP[role] ?? 'gray';
  const label = t(`roles.${role}`);

  return (
    <Badge
      color={color}
      size={size}
      variant={variant}
      radius={radius}
      {...badgeProps}
    >
      {label}
    </Badge>
  );
};
