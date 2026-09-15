import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Alert, Button, Paper, Stack } from '@mantine/core';
import { useGetMyShiftById } from '@/api/generated/endpoints/shifts/shifts';
import { ROUTES } from '@/config/routes';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';
import { DriverShiftEditForm } from '../../components/driver/DriverShiftEditForm';

export const DriverEditShiftPage = () => {
  const { t } = useTranslation(['app', 'common']);
  const { shiftId } = useParams<{ shiftId: string }>();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    error,
  } = useGetMyShiftById(Number(shiftId), {
    query: {
      enabled: !!shiftId && !isNaN(Number(shiftId)),
    },
  });

  const shift = response?.data;
  const isPendingStatus = shift?.status === 'PENDING';

  return (
    <PageLayout
      title={`${t('app:shifts.edit_page_title')} #${shiftId}`}
      showBack
    >
      <DataLoadingWrapper
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !shift}
      >
        {shift && isPendingStatus && <DriverShiftEditForm shift={shift} />}

        {shift && !isPendingStatus && (
          <Paper
            withBorder
            p="xl"
            radius="md"
          >
            <Stack
              align="center"
              gap="md"
            >
              <Alert
                icon={<AlertCircle size={20} />}
                title={t('app:shifts.errors.cannot_edit_title')}
                color="orange"
                radius="md"
              >
                {t('app:shifts.errors.cannot_edit_non_pending')}
              </Alert>
              <Button
                variant="light"
                onClick={() => navigate(ROUTES.app.driver.shifts.view.getHref(shift.id!))}
              >
                {t('common:actions.back', 'Zurück zur Schicht')}
              </Button>
            </Stack>
          </Paper>
        )}
      </DataLoadingWrapper>
    </PageLayout>
  );
};

export default DriverEditShiftPage;
