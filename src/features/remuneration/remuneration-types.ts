export enum RemunerationModelType {
  PERCENTAGE_SHARE = 'PERCENTAGE_SHARE',
  WEEKLY_FIXED_RATE = 'WEEKLY_FIXED_RATE',
  FLAT_RATE = 'FLAT_RATE',
}

export type PercentageShareRemunerationConfig = {
  remunerationModelType: RemunerationModelType.PERCENTAGE_SHARE;
  minDriverPayout: number;
  driverRevenueSharePercentage: number;
};

export type WeeklyFixedRemunerationConfig = {
  remunerationModelType: RemunerationModelType.WEEKLY_FIXED_RATE;
  weeklyFixedCompanySettlement: number;
  settlementDay: number;
};

export type FlatRateRemunerationConfig = {
  remunerationModelType: RemunerationModelType.FLAT_RATE;
  flatRateFee: number;
};

export type RemunerationConfig =
  | PercentageShareRemunerationConfig
  | WeeklyFixedRemunerationConfig
  | FlatRateRemunerationConfig;