import { ChevronRight, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { NavLink as $NavLink, useLocation, useNavigate } from 'react-router';
import {
  Avatar,
  Box,
  Divider,
  Group,
  Menu,
  NavLink,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { NAV_ITEMS, NavItem } from '@/config/navigation.config';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUserRole } from '@/features/auth/hooks/useUserHasRole';
import classes from './Navbar.module.css';

interface NavBarProps {
  onNavigate?: () => void;
}

export const NavBar = ({ onNavigate }: NavBarProps) => {
  const location = useLocation();
  const { t } = useTranslation(['common', 'app']);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { role } = useUserRole();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate(ROUTES.auth.login.path);
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : t('app:auth.logout.error');
        toast.error(errorMessage);
      },
    });
  };

  const isNavActive = (itemHref: string, currentPath: string) => {
    if (itemHref === '/' || itemHref === '') {
      return currentPath === itemHref;
    }
    return currentPath === itemHref || currentPath.startsWith(`${itemHref}/`);
  };

  const filterByRole = (items: NavItem[] = []) =>
    items.filter((item) => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      return role ? item.roles.includes(role) : false;
    });

  const overviewItems = filterByRole(NAV_ITEMS.overview);
  const operationsItems = filterByRole(NAV_ITEMS.operations);
  const administrationItems = filterByRole(NAV_ITEMS.administration);

  const createLinks = (data: NavItem[]) =>
    data.map((item) => {
      const isActive = isNavActive(item.href, location.pathname);
      return (
        <NavLink
          onClick={onNavigate}
          component={$NavLink}
          key={item.id}
          to={item.path}
          label={t(item.labelKey, { ns: 'common' })}
          active={isActive}
          className={classes.navLink}
          leftSection={
            <item.icon
              size={18}
              strokeWidth={isActive ? 2.2 : 1.7}
            />
          }
        />
      );
    });

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : (user?.email ?? t('common:user'));

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.firstName
        ? user.firstName[0].toUpperCase()
        : null;

  return (
    <Stack
      justify="space-between"
      h="100%"
    >
      <Box>
        {overviewItems.length > 0 && (
          <Box mb="md">
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              c="dimmed"
              style={{ letterSpacing: '0.06em' }}
              px="xs"
              mb="xs"
            >
              {t('common:overview')}
            </Text>
            {createLinks(overviewItems)}
          </Box>
        )}

        {operationsItems.length > 0 && (
          <>
            {overviewItems.length > 0 && (
              <Divider
                my="md"
                color="gray.2"
              />
            )}
            <Box mb="md">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                c="dimmed"
                style={{ letterSpacing: '0.06em' }}
                px="xs"
                mb="xs"
              >
                {t('common:operations')}
              </Text>
              {createLinks(operationsItems)}
            </Box>
          </>
        )}

        {administrationItems.length > 0 && (
          <>
            {(overviewItems.length > 0 || operationsItems.length > 0) && (
              <Divider
                my="md"
                color="gray.2"
              />
            )}
            <Box>
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                c="dimmed"
                style={{ letterSpacing: '0.06em' }}
                px="xs"
                mb="xs"
              >
                {t('common:administration')}
              </Text>
              {createLinks(administrationItems)}
            </Box>
          </>
        )}
      </Box>

      <Box pt="sm">
        <Divider
          mb="md"
          color="gray.2"
        />
        <Menu
          position="top-end"
          shadow="md"
          width={240}
          radius="md"
        >
          <Menu.Target>
            <UnstyledButton
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--mantine-radius-md)',
                transition: 'background-color 150ms ease',
              }}
              className="user-menu-btn"
            >
              <Group
                justify="space-between"
                wrap="nowrap"
              >
                <Group
                  gap="sm"
                  wrap="nowrap"
                  style={{ overflow: 'hidden' }}
                >
                  <Avatar
                    color="blue"
                    radius="xl"
                    size="sm"
                  >
                    {initials ?? <User size={16} />}
                  </Avatar>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      size="sm"
                      fw={600}
                      truncate="end"
                    >
                      {displayName}
                    </Text>
                    {user?.email && (
                      <Text
                        size="xs"
                        c="dimmed"
                        truncate="end"
                      >
                        {user.email}
                      </Text>
                    )}
                  </Box>
                </Group>
                <ChevronRight
                  size={16}
                  style={{ opacity: 0.5, flexShrink: 0 }}
                />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{displayName}</Menu.Label>
            <Menu.Item
              color="red"
              leftSection={<LogOut size={16} />}
              onClick={handleLogout}
            >
              {t('app:auth.logout.title')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Stack>
  );
};
