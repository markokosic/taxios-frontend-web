import {
  RemunerationConfigResponse,
  FlatRateRemunerationResponse,
} from '@/api/generated/model';
import { DriverShiftFlatRateOption } from '../domain/shift-calculations';

export const extractShiftFlatRateOptions = (
  configs?: RemunerationConfigResponse[] | null,
  fallbackName?: string
): DriverShiftFlatRateOption[] => {
  return (configs || [])
    .filter((c) => c.remunerationModelType === 'FLAT_RATE')
    .map((c) => {
      const flatConfig = c as FlatRateRemunerationResponse;
      return {
        id: flatConfig.flatRateTypeId,
        name: flatConfig.flatRateTypeName || fallbackName || 'Pauschalfahrt',
        defaultPrice: flatConfig.defaultPrice,
      };
    });
};
