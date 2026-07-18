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
}

export const PageLayout = ({
  children,
  title,
  showBack = true,
  backFallback = -1,
  actions,
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
    <Box maw={1280}>
      <title>{title}</title>
      <Group
        justify="space-between"
        align="center"
        mb="md"
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
      {children}
    </Box>
  );
};
