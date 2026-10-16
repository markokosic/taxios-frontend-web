import {
  AllowedFlatRateType,
  RemunerationConfigResponse,
  ShiftRevenueEntryResponse,
  ShiftRevenueEntryResponseEntryCategory,
} from '@/api/generated/model';
import { isBaseRemunerationModel } from '@/features/drivers/domain/remuneration-rules';
import { RemunerationModelType } from '@/features/drivers/domain/remuneration-types';
import { DriverShiftFlatRateOption } from '../domain/shift-calculations';

interface BuildShiftFlatRateOptionsParams {
  /** Flat rides the driver is allowed to enter, taken from the driver profile. */
  allowedFlatRateTypes?: AllowedFlatRateType[] | null;
  /** Entries already stored on the shift, they stay editable even if the driver lost the permission since. */
  existingRevenues?: ShiftRevenueEntryResponse[] | null;
  fallbackName?: string;
}

export const buildShiftFlatRateOptions = ({
  allowedFlatRateTypes,
  existingRevenues,
  fallbackName,
}: BuildShiftFlatRateOptionsParams): DriverShiftFlatRateOption[] => {
  const options = new Map<number, DriverShiftFlatRateOption>();

  (allowedFlatRateTypes ?? []).forEach((type) => {
    if (type.id === undefined || type.id === null) {return;}
    options.set(type.id, {
      id: type.id,
      name: type.name || fallbackName || 'Pauschalfahrt',
      defaultPrice: type.defaultPrice,
    });
  });

  (existingRevenues ?? [])
    .filter((r) => r.entryCategory === ShiftRevenueEntryResponseEntryCategory.FLAT_RATE)
    .forEach((r) => {
      if (r.flatRateTypeId === undefined || r.flatRateTypeId === null || options.has(r.flatRateTypeId)) {
        return;
      }
      options.set(r.flatRateTypeId, {
        id: r.flatRateTypeId,
        name: r.flatRateTypeName || fallbackName || 'Pauschalfahrt',
        defaultPrice: r.pricePerTrip,
      });
    });

  return [...options.values()];
};

/** Cash rides are available as soon as the driver has any base remuneration model (or none yet). */
export const hasCashRidesForConfigs = (configs?: RemunerationConfigResponse[] | null): boolean => {
  const list = configs ?? [];
  return (
    list.length === 0 ||
    list.some((c) => isBaseRemunerationModel(c.remunerationModelType as RemunerationModelType))
  );
};
