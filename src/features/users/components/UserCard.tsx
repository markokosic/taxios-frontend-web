import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { Mail, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserResponse } from '@/api/generated/model';
import { UserRoleBadge } from './UserRoleBadge';

interface UserCardProps {
  user: UserResponse;
}

export const UserCard = ({ user }: UserCardProps) => {
  const { t } = useTranslation(['common', 'app']);

  const isPendingPasswordChange = Boolean(user.mustChangePassword);
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || t('common:user');

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      h="100%"
      w={{ base: '100%', sm: 320 }}
    >
      <Stack
        gap="xs"
        justify="space-between"
        style={{ height: '100%' }}
      >
        <Stack gap="xs">
          {/* Top Row: Status Badge */}
          <Group justify="flex-start">
            <Badge
              variant="light"
              color={isPendingPasswordChange ? 'orange' : 'green'}
              size="xs"
            >
              {isPendingPasswordChange
                ? t('common:user_status.pending_password_change')
                : t('common:user_status.active')}
            </Badge>
          </Group>

          {/* User Name */}
          <Group gap="xs" wrap="nowrap">
            <User
              size={18}
              color="var(--mantine-color-blue-6)"
              style={{ flexShrink: 0 }}
            />
            <Text
              fw={600}
              size="md"
              truncate
              style={{ flex: 1 }}
            >
              {fullName}
            </Text>
          </Group>

          {/* Contact Info: Email */}
          <Stack gap="4px">
            {user.email && (
              <Group gap="xs" c="dimmed" wrap="nowrap">
                <Mail
                  size={14}
                  style={{ flexShrink: 0 }}
                />
                <Text
                  size="xs"
                  truncate
                >
                  {user.email}
                </Text>
              </Group>
            )}
          </Stack>
        </Stack>

        {/* Bottom Row: Role Badge */}
        {user.roles && (
          <Group gap="xs" mt="xs">
            <UserRoleBadge role={user.roles} />
          </Group>
        )}
      </Stack>
    </Card>
  );
};
