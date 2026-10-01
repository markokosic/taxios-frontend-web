import { forwardRef } from 'react';
import { ActionIcon, ActionIconProps, Affix } from '@mantine/core';

interface FloatingActionButtonProps extends ActionIconProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ onClick, children, ...props }, ref) => {
    return (
      <Affix position={{ bottom: 24, right: 24 }}>
        <ActionIcon
          ref={ref}
          size="xl"
          radius="xl"
          onClick={onClick}
          {...props}
        >
          {children}
        </ActionIcon>
      </Affix>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';
