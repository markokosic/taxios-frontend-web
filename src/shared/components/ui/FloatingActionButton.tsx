import { ActionIcon, ActionIconProps, Affix } from '@mantine/core';

interface FloatingActionButtonProps extends ActionIconProps {
  onClick: () => void;
}

export const FloatingActionButton = ({
  onClick,
  children,
  ...props
}: FloatingActionButtonProps) => {
  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <ActionIcon
        size="xl"
        radius="xl"
        onClick={onClick}
        {...props}
      >
        {children}
      </ActionIcon>
    </Affix>
  );
};
