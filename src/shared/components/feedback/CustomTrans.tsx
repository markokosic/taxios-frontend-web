import { Trans } from 'react-i18next';
import type React from 'react';

type TProps = React.ComponentProps<typeof Trans> & {
  className?: string;
};

function CustomTrans({ className, ...props }: TProps) {
  return (
    <Trans
      {...props}
      className={className}
    />
  );
}

export { CustomTrans };
