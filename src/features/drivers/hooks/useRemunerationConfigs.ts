import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { RemunerationModelType } from '../domain/remuneration-types';

/** Shape of one entry of the form array `remunerationConfigs` as far as the form sections care. */
export type RemunerationConfigFormValue = {
  remunerationModelType?: RemunerationModelType;
  flatRateTypeId?: number | null;
  driverSharePercentage?: number | null;
  [key: string]: unknown;
};

/**
 * Gives the form sections read/write access to the same `remunerationConfigs` array.
 * The sections only add, change and remove entries, the schema stays the single place for validation.
 */
export const useRemunerationConfigs = () => {
  const { control, setValue } = useFormContext();
  const configs = (useWatch({ control, name: 'remunerationConfigs' }) ??
    []) as RemunerationConfigFormValue[];

  const setConfigs = useCallback(
    (next: RemunerationConfigFormValue[]) =>
      setValue('remunerationConfigs', next, { shouldDirty: true, shouldValidate: true }),
    [setValue]
  );

  return { configs, setConfigs };
};
