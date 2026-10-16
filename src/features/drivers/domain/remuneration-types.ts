export enum RemunerationModelType {
  PERCENTAGE_SHARE = 'PERCENTAGE_SHARE',
  WEEKLY_FIXED_RATE = 'WEEKLY_FIXED_RATE',
  FLAT_RATE = 'FLAT_RATE',
  FLAT_RATE_PERCENTAGE = 'FLAT_RATE_PERCENTAGE',
  FIXED_PER_SHIFT = 'FIXED_PER_SHIFT',
}

export type WeeklyFixedRemunerationConfig = {
  remunerationModelType: RemunerationModelType.WEEKLY_FIXED_RATE;
  weeklyFixedCompanySettlement: number;
  settlementDay: number;
};

export type FlatRateRemunerationConfig = {
  remunerationModelType: RemunerationModelType.FLAT_RATE;
  driverFlatRatePayoutPerShift: number;
  flatRateTypeId?: number | null;
  flatRateTypeName?: string | null;
};

export type FlatRatePercentageRemunerationConfig = {
  remunerationModelType: RemunerationModelType.FLAT_RATE_PERCENTAGE;
  driverSharePercentage: number;
  flatRateTypeId?: number | null;
  flatRateTypeName?: string | null;
};

export type FixedPerShiftRemunerationConfig = {
  remunerationModelType: RemunerationModelType.FIXED_PER_SHIFT;
  driverPayoutPerShift: number;
};
