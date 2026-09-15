import { Link, LinkProps } from 'react-router';
import { Anchor, AnchorProps } from '@mantine/core';

interface AppLinkProps extends AnchorProps, Omit<LinkProps, 'color' | 'style' | 'ref'> {}

const AppLink = ({ to, children, ...props }: AppLinkProps) => {
  return (
    <Anchor
      underline="never"
      component={Link}
      to={to}
      {...props}
    >
      {children}
    </Anchor>
  );
};

export { AppLink };
