export enum RemunerationModelType {
  PERCENTAGE_SHARE = 'PERCENTAGE_SHARE',
  WEEKLY_FIXED_RATE = 'WEEKLY_FIXED_RATE',
  FLAT_RATE = 'FLAT_RATE',
}

export type WeeklyFixedRemunerationConfig = {
  remunerationModelType: RemunerationModelType.WEEKLY_FIXED_RATE;
  weeklyFixedCompanySettlement: number;
  settlementDay: number;
};

export type FlatRateRemunerationConfig = {
  remunerationModelType: RemunerationModelType.FLAT_RATE;
  flatRateFee: number;
};

