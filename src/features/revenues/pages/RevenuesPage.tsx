import { PlusCircle, ReceiptEuro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from 'src/components/layout/PageLayout';
import { useMediaQuery } from '@mantine/hooks';
import { ActionMenu } from '@/components/ui/Menu';
import { SpeedDial } from '@/components/ui/Menu/SpeedDial';

export const RevenuesPage = () => {
  const { t } = useTranslation();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const menuActions = [
    {
      label: 'Add daily revenues',
      icon: ReceiptEuro,
      onClick: () => null,
    },
    {
      label: 'Add single revenue',
      icon: ReceiptEuro,
      onClick: () => null,
    },
  ];

  return (
    <PageLayout
      title={t('common:revenues')}
      showBack={false}
      actions={<ActionMenu actions={menuActions} />}
    >
      {isMobile && (
        <SpeedDial
          actions={menuActions}
          Icon={PlusCircle}
        />
      )}
    </PageLayout>
  );
};
