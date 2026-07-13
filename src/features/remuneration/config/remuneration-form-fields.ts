import { RemunerationModelType } from '../remuneration-types';

export const REMUNERATION_FORM_FIELDS = {
  type: {
    name: 'remunerationModelType',
    labelKey: 'form.remunerationType.label',
    placeholderKey: 'form.remunerationType.placeholder',
    type: 'select',
    options: [
      {
        label: 'app:remuneration.type.percentageShare',
        value: RemunerationModelType.PERCENTAGE_SHARE,
      },
      {
        label: 'app:remuneration.type.weeklyFixedRate',
        value: RemunerationModelType.WEEKLY_FIXED_RATE,
      },
    ],
  },

  percentageShare: {
    minDriverPayout: {
      name: 'minDriverPayout',
      labelKey: 'form.minDriverPayout.label',
      placeholderKey: 'form.minDriverPayout.placeholder',
      type: 'number',
    },

    driverRevenueSharePercentage: {
      name: 'driverRevenueSharePercentage',
      labelKey: 'form.driverRevenueSharePercentage.label',
      placeholderKey: 'form.driverRevenueSharePercentage.placeholder',
      type: 'number',
    },
  },

  weeklyFixedRate: {
    weeklyFixedCompanySettlement: {
      name: 'weeklyFixedCompanySettlement',
      labelKey: 'form.weeklyFixedCompanySettlement.label',
      placeholderKey: 'form.weeklyFixedCompanySettlement.placeholder',
      type: 'number',
    },

    settlementDay: {
      name: 'settlementDay',
      labelKey: 'form.settlementDay.label',
      placeholderKey: 'form.settlementDay.placeholder',
      type: 'select',
    },
  },

  flatRate: {
    flatRateFee: {
      name: 'flatRateFee',
      labelKey: 'form.flatRateFee.label',
      placeholderKey: 'form.flatRateFee.placeholder',
      type: 'number',
    },
  },
};
