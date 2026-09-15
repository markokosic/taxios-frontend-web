import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Box, Container, Group, Loader, Text, ThemeIcon } from '@mantine/core';
import { Car } from 'lucide-react';
import { LanguagePicker } from '@/shared/components/ui/LanguagePicker';

const AuthLayout = () => {
  return (
    <Box bg="gray.0" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top navigation header without borders */}
      <Box px="xl" py="lg">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="md" color="blue" variant="filled">
              <Car size={18} />
            </ThemeIcon>
            <Text fw={800} size="md" style={{ letterSpacing: '-0.02em' }}>
              Taxi<Text span color="blue.6" inherit>OS</Text>
            </Text>
          </Group>
          <LanguagePicker />
        </Group>
      </Box>



      {/* Main centered Auth Form Card Container */}
      <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} p="md">
        <Container size={440} w="100%" px={0}>
          <Suspense fallback={<Loader color="blue" />}>
            <Outlet />
          </Suspense>
        </Container>
      </Box>

    </Box>
  );
};

export { AuthLayout };
