import { ReactNode } from 'react';
import { MoveLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { Box, Button, Group, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  backFallback?: number;
  actions?: ReactNode;
  fullHeight?: boolean;
}

export const PageLayout = ({
  children,
  title,
  showBack = true,
  backFallback = -1,
  actions,
  fullHeight = false,
}: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const goBack = () => {
    const previous = location.state?.from;
    if (previous) {
      navigate(previous);
    } else {
      navigate(backFallback);
    }
  };

  return (
    <Box
      maw={1600}
      w="100%"
      h="100%"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <title>{title}</title>
      <Group
        justify="space-between"
        align="center"
        mb="md"
        style={{ flexShrink: 0 }}
      >
        <Group
          gap="sm"
          align="center"
        >
          {showBack && (
            <Button
              size="sm"
              variant="light"
              onClick={goBack}
            >
              <MoveLeft />
            </Button>
          )}
          <Title order={1}>{title}</Title>
        </Group>
        {!isMobile && (
          <Group
            gap="sm"
            align="center"
          >
            {actions}
          </Group>
        )}
      </Group>
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: fullHeight ? 'hidden' : 'auto',
          minHeight: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
