import { PlusCircle, ReceiptEuro } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PageLayout } from 'src/components/layout/PageLayout';
import { useMediaQuery } from '@mantine/hooks';
import { ActionMenu } from '@/components/ui/Menu';
import { SpeedDial } from '@/components/ui/Menu/SpeedDial';
import { ROUTES } from '@/config/routes';

export const RevenuesPage = () => {
  const { t } = useTranslation(['revenues']);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const navigateToBulkRevenues = () => navigate(ROUTES.app.revenues.createBulk.getHref());

  const menuActions = [
    {
      label: t('record_revenue.daily'),
      icon: ReceiptEuro,
      onClick: navigateToBulkRevenues,
    },
    // {
    //   //TODO OPEN MODAL HERE
    //   label: t('record_revenue.single'),
    //   icon: ReceiptEuro,
    //   onClick: () => null,
    // },
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
