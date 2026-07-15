import { RemunerationModelType } from '../remuneration-types';

export const REMUNERATION_FORM_FIELDS = {
  type: {
    name: 'remunerationModelType',
    labelKey: 'common:form.remunerationType.label',
    placeholderKey: 'common:form.remunerationType.placeholder',
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
      labelKey: 'common:form.minDriverPayout.label',
      placeholderKey: 'common:form.minDriverPayout.placeholder',
      type: 'number',
    },

    driverRevenueSharePercentage: {
      name: 'driverRevenueSharePercentage',
      labelKey: 'common:form.driverRevenueSharePercentage.label',
      placeholderKey: 'common:form.driverRevenueSharePercentage.placeholder',
      type: 'number',
    },
  },

  weeklyFixedRate: {
    weeklyFixedCompanySettlement: {
      name: 'weeklyFixedCompanySettlement',
      labelKey: 'common:form.weeklyFixedCompanySettlement.label',
      placeholderKey: 'common:form.weeklyFixedCompanySettlement.placeholder',
      type: 'number',
    },

    settlementDay: {
      name: 'settlementDay',
      labelKey: 'common:form.settlementDay.label',
      placeholderKey: 'common:form.settlementDay.placeholder',
      type: 'select',
    },
  },

  flatRate: {
    flatRateFee: {
      name: 'flatRateFee',
      labelKey: 'common:form.flatRateFee.label',
      placeholderKey: 'common:form.flatRateFee.placeholder',
      type: 'number',
    },
  },
};
