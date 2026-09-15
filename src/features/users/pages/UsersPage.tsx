import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { UsersList } from '../components/UsersList';

export const UsersPage = () => {
  const { t } = useTranslation(['common', 'app']);

  return (
    <PageLayout
      title={t('common:navigation.users')}
      showBack={false}
      fullHeight
    >
      <UsersList />
    </PageLayout>
  );
};

export default UsersPage;
