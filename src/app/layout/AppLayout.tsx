import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { AppShell, Box, Burger, Group, LoadingOverlay, Text, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Car } from 'lucide-react';
import { NavBar } from './Navbar';

type AppLayoutProps = {
  overlayVisible: boolean;
};

const AppLayout = ({ overlayVisible: _overlayVisible }: AppLayoutProps) => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group gap="xs">
              <ThemeIcon size="lg" radius="md" color="blue" variant="filled">
                <Car size={20} />
              </ThemeIcon>
              <Text size="lg" fw={800} style={{ letterSpacing: '-0.02em' }}>
                Taxi<Text span color="blue.6" inherit>OS</Text>
              </Text>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavBar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            maxWidth: 1600,
            width: '100%',
            margin: '0 auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Suspense fallback={<LoadingOverlay visible zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />}>
            <Outlet />
          </Suspense>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export { AppLayout };

