import { Outlet } from 'react-router';
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavBar } from '@/components/ui/Navbar/Navbar';

type AppLayoutProps = {
  overlayVisible: boolean;
};

const AppLayout = ({ overlayVisible: _overlayVisible }: AppLayoutProps) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
        >
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/* <Navbar toggle={toggle} /> */}
        <NavBar />
      </AppShell.Navbar>

      <AppShell.Main>
        {/* <LoadingOverlay
          visible={overlayVisible}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ type: 'dots' }}
        /> */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export { AppLayout };
