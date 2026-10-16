import { describe, expect, it } from 'vitest';
import { getCreateDriverSchema, getUpdateDriverSchema } from '../drivers-schemas';
import { RemunerationModelType } from '../remuneration-types';

const mockT = (key: string) => key;

describe('drivers-schemas validation', () => {
  const validPercentageConfig = {
    remunerationModelType: RemunerationModelType.PERCENTAGE_SHARE,
    driverRevenueSharePercentage: 45,
    minDriverPayoutPerShift: 50,
  };

  const validWeeklyConfig = {
    remunerationModelType: RemunerationModelType.WEEKLY_FIXED_RATE,
    weeklyFixedCompanySettlement: 400,
    settlementDay: 7,
  };

  const validFlatRateConfig = {
    remunerationModelType: RemunerationModelType.FLAT_RATE_PERCENTAGE,
    driverSharePercentage: 15,
    flatRateTypeId: 1,
  };

  const validFixedPerShiftConfig = {
    remunerationModelType: RemunerationModelType.FIXED_PER_SHIFT,
    driverPayoutPerShift: 80,
  };

  const baseDriver = {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    phone: '+436601234567',
  };

  it('allows percentage share alone', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validPercentageConfig],
    });
    expect(result.success).toBe(true);
  });

  it('allows weekly fixed rate alone', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validWeeklyConfig],
    });
    expect(result.success).toBe(true);
  });

  it('allows percentage share with percentage on flat rides', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validPercentageConfig, validFlatRateConfig],
    });
    expect(result.success).toBe(true);
  });

  it('allows weekly fixed rate with percentage on flat rides', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validWeeklyConfig, validFlatRateConfig],
    });
    expect(result.success).toBe(true);
  });

  it('fails when both percentage share and weekly fixed rate are supplied', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+436601234567',
      remunerationConfigs: [validPercentageConfig, validWeeklyConfig],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('incompatible_remuneration_models');
    }
  });

  it('fails update schema when both percentage and weekly are supplied', () => {
    const schema = getUpdateDriverSchema(mockT as any);
    const result = schema.safeParse({
      remunerationConfigs: [validPercentageConfig, validWeeklyConfig],
    });
    expect(result.success).toBe(false);
  });
  it('allows percentage share combined with fixed payout per shift', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      ...baseDriver,
      remunerationConfigs: [validPercentageConfig, validFixedPerShiftConfig],
    });
    expect(result.success).toBe(true);
  });

  it('allows fixed payout per shift combined with percentage on flat rides', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      ...baseDriver,
      remunerationConfigs: [validFixedPerShiftConfig, validFlatRateConfig],
    });
    expect(result.success).toBe(true);
  });

  it('fails when weekly fixed rate is combined with fixed payout per shift', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      ...baseDriver,
      remunerationConfigs: [validWeeklyConfig, validFixedPerShiftConfig],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('incompatible_remuneration_models');
    }
  });

  it('fails when only the flat ride percentage is supplied without a base model', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      ...baseDriver,
      remunerationConfigs: [validFlatRateConfig],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('base_model_required');
    }
  });

  it('accepts the allowed flat rate type ids', () => {
    const schema = getCreateDriverSchema(mockT as any);
    const result = schema.safeParse({
      ...baseDriver,
      remunerationConfigs: [validFixedPerShiftConfig],
      allowedFlatRateTypeIds: [1, 2],
    });
    expect(result.success).toBe(true);
  });
});
