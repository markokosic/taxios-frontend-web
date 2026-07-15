import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { NavLink as $NavLink, useLocation, useNavigate } from 'react-router';
import { Box, Button, Divider, Menu, NavLink, Text } from '@mantine/core';
import { NAV_ITEMS, NavItem } from '@/config/navigation';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const NavBar = () => {
  const location = useLocation();
  const { t } = useTranslation(['common', 'app']);

  const createLinks = (data: NavItem[]) =>
    data.map((item) => {
      return (
        <NavLink
          styles={{
            root: {
              borderRadius: 'var(--mantine-radius-xl)',
            },
          }}
          component={$NavLink}
          key={item.id}
          to={item.path}
          label={t(item.labelKey, { ns: 'common' })}
          active={item.href === location.pathname}
          leftSection={<item.icon size={16} />}
        />
      );
    });

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate(ROUTES.auth.login.path);
      },
      onError: (error: any) => {
        const errorMessage =
          error instanceof Error ? error.message : t('app:auth.logout.error');
        toast.error(errorMessage);
      },
    });
  };

  return (
    <>
      <Box>
        <Text
          size="xs"
          tt="uppercase"
          c="dimmed"
        >
          {t('common:general')}
        </Text>
        {createLinks(NAV_ITEMS.general)}
      </Box>
      <Divider my="md" />

      <Box>
        <Text
          size="xs"
          tt="uppercase"
          c="dimmed"
        >
          {t('common:support')}
        </Text>
        {createLinks(NAV_ITEMS.support)}
      </Box>
      <Menu>
        <Menu.Target>
          <Button>{t('common:user')}</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={handleLogout}>{t('app:auth.logout.title')}</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
