import { describe, expect, it } from 'vitest';
import { ShiftRevenueEntryResponseEntryCategory } from '@/api/generated/model';
import { extractShiftFlatRateOptions } from '../shift-options.utils';

describe('extractShiftFlatRateOptions', () => {
  it('returns empty array when configs is null or undefined', () => {
    expect(extractShiftFlatRateOptions(null)).toEqual([]);
    expect(extractShiftFlatRateOptions(undefined)).toEqual([]);
  });

  it('filters out non-flat-rate configs', () => {
    const configs: any[] = [
      {
        id: 1,
        remunerationModelType: 'PERCENTAGE_SHARE',
      },
      {
        id: 2,
        remunerationModelType: 'WEEKLY_FIXED_RATE',
      },
    ];

    expect(extractShiftFlatRateOptions(configs)).toEqual([]);
  });

  it('maps flat rate configs into DriverShiftFlatRateOption format with custom names', () => {
    const configs: any[] = [
      {
        id: 1,
        remunerationModelType: 'FLAT_RATE',
        flatRateTypeId: 10,
        flatRateTypeName: 'Flughafentransfer',
        defaultPrice: 45,
      },
    ];

    expect(extractShiftFlatRateOptions(configs)).toEqual([
      {
        id: 10,
        name: 'Flughafentransfer',
        defaultPrice: 45,
      },
    ]);
  });

  it('falls back to provided fallbackName or default if flatRateTypeName is missing', () => {
    const configs: any[] = [
      {
        id: 1,
        remunerationModelType: 'FLAT_RATE',
        flatRateTypeId: 12,
        defaultPrice: 30,
      },
    ];

    expect(extractShiftFlatRateOptions(configs, 'Standard-Pauschale')).toEqual([
      {
        id: 12,
        name: 'Standard-Pauschale',
        defaultPrice: 30,
      },
    ]);

    expect(extractShiftFlatRateOptions(configs)).toEqual([
      {
        id: 12,
        name: 'Pauschalfahrt',
        defaultPrice: 30,
      },
    ]);
  });
});
