import { describe, expect, it } from 'vitest';
import { buildShiftFlatRateOptions, hasCashRidesForConfigs } from '../shift-options.utils';

describe('buildShiftFlatRateOptions', () => {
  it('returns empty array when nothing is allowed and the shift has no flat ride entries', () => {
    expect(buildShiftFlatRateOptions({})).toEqual([]);
    expect(buildShiftFlatRateOptions({ allowedFlatRateTypes: null, existingRevenues: null })).toEqual([]);
  });

  it('maps the allowed flat rate types of the driver', () => {
    expect(
      buildShiftFlatRateOptions({
        allowedFlatRateTypes: [{ id: 10, name: 'Wien -> Graz', defaultPrice: 100 }],
      })
    ).toEqual([{ id: 10, name: 'Wien -> Graz', defaultPrice: 100 }]);
  });

  it('falls back to the given name if the type has no name', () => {
    expect(
      buildShiftFlatRateOptions({
        allowedFlatRateTypes: [{ id: 12, defaultPrice: 30 }],
        fallbackName: 'Standard-Pauschale',
      })
    ).toEqual([{ id: 12, name: 'Standard-Pauschale', defaultPrice: 30 }]);
  });

  it('keeps flat rides that are already stored on the shift although they are no longer allowed', () => {
    const options = buildShiftFlatRateOptions({
      allowedFlatRateTypes: [{ id: 10, name: 'Wien -> Graz', defaultPrice: 100 }],
      existingRevenues: [
        { id: 1, entryCategory: 'FLAT_RATE', flatRateTypeId: 11, flatRateTypeName: 'Flughafen', pricePerTrip: 36 },
        { id: 2, entryCategory: 'FLAT_RATE', flatRateTypeId: 10, flatRateTypeName: 'Wien -> Graz', pricePerTrip: 100 },
        { id: 3, entryCategory: 'REGULAR', revenue: 20 },
      ] as any,
    });

    expect(options).toEqual([
      { id: 10, name: 'Wien -> Graz', defaultPrice: 100 },
      { id: 11, name: 'Flughafen', defaultPrice: 36 },
    ]);
  });
});

describe('hasCashRidesForConfigs', () => {
  it('is true for drivers without configs', () => {
    expect(hasCashRidesForConfigs([])).toBe(true);
    expect(hasCashRidesForConfigs(null)).toBe(true);
  });

  it.each(['PERCENTAGE_SHARE', 'WEEKLY_FIXED_RATE', 'FIXED_PER_SHIFT'])('is true with base model %s', (type) => {
    expect(hasCashRidesForConfigs([{ remunerationModelType: type }])).toBe(true);
  });

  it('is false with only an addon model', () => {
    expect(hasCashRidesForConfigs([{ remunerationModelType: 'FLAT_RATE_PERCENTAGE' }])).toBe(false);
  });
});
