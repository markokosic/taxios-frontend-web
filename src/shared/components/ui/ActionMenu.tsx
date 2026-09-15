import { MouseEventHandler, Fragment } from 'react';
import { EllipsisVertical, LucideIcon } from 'lucide-react';
import { Button, Menu, MenuItemProps, MenuProps } from '@mantine/core';

export interface Action extends MenuItemProps {
  label: string;
  icon: LucideIcon;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDanger?: boolean;
  hasDivider?: boolean;
}

interface ActionMenuProps extends MenuProps {
  actions: Action[];
  isRound?: boolean;
}

export const ActionMenu = ({ actions, isRound, ...props }: ActionMenuProps) => {
  return (
    <Menu
      shadow="md"
      width={200}
      withArrow
      position="bottom-end"
      {...props}
    >
      <Menu.Target>
        <Button
          radius="100%"
          size="lg"
          styles={{
            root: {
              width: 48,
              height: 48,
              padding: 0,
            },
          }}
          variant="light"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisVertical />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {actions.map((action, index) => {
          const { isDanger, hasDivider, ...rest } = action;
          return (
            <Fragment key={action.label}>
              {(hasDivider || isDanger) && index > 0 && <Menu.Divider />}
              <Menu.Item
                {...rest}
                color={isDanger ? 'red' : rest.color}
                leftSection={<action.icon size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick?.(e);
                }}
              >
                {action.label}
              </Menu.Item>
            </Fragment>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};
