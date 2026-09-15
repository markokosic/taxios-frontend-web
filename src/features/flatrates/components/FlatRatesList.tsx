import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Text } from '@mantine/core';
import { useGetActiveFlatRateTypes } from '@/api/generated/endpoints/flat-rate-types/flat-rate-types';
import { FlatRateTypeResponse } from '@/api/generated/model';
import { DataLoadingWrapper } from '@/shared/components/ui/DataLoadingWrapper';

import { EditFlatRateModal } from './EditFlatRateModal';
import { FlatRatesListSkeleton } from './FlatRatesListSkeleton';
import { useDeactivateFlatRateAction } from '../hooks/useDeactivateFlatRateAction';
import { FlatRatesTable } from './FlatRatesTable';

export const FlatRatesList = () => {
  const { t } = useTranslation(['app', 'common']);
  const [editingFlatRate, setEditingFlatRate] = useState<FlatRateTypeResponse | null>(null);

  const { data: response, isLoading, error } = useGetActiveFlatRateTypes();
  const flatRates = response?.data || [];
  const isEmpty = !isLoading && flatRates.length === 0;

  const { handleDeactivate } = useDeactivateFlatRateAction();

  const actions = {
    onEdit: setEditingFlatRate,
    onDeactivate: handleDeactivate,
  };

  return (
    <>
      <DataLoadingWrapper
        isLoading={isLoading}
        error={error as Error | null}
        isEmpty={isEmpty}
        skeleton={<FlatRatesListSkeleton />}
        emptyFallback={
          <Paper withBorder p="xl" radius="md" ta="center">
            <Text c="dimmed">
              {t('app:flatrate.empty')}
            </Text>
          </Paper>
        }
      >
        <FlatRatesTable
          flatRates={flatRates}
          actions={actions}
        />
      </DataLoadingWrapper>

      <EditFlatRateModal
        flatRate={editingFlatRate}
        opened={!!editingFlatRate}
        onClose={() => setEditingFlatRate(null)}
      />
    </>
  );
};
