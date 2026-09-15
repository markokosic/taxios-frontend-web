import { RemunerationModelType } from './remuneration-types';

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
    minDriverPayoutPerShift: {
      name: 'minDriverPayoutPerShift',
      labelKey: 'common:form.minDriverPayoutPerShift.label',
      placeholderKey: 'common:form.minDriverPayoutPerShift.placeholder',
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
    driverFlatRatePayoutPerShift: {
      name: 'driverFlatRatePayoutPerShift',
      labelKey: 'common:form.driverFlatRatePayoutPerShift.label',
      placeholderKey: 'common:form.driverFlatRatePayoutPerShift.placeholder',
      type: 'number',
    },
    flatRateTypeId: {
      name: 'flatRateTypeId',
      labelKey: 'common:form.flatRateTypeId.label',
      placeholderKey: 'common:form.flatRateTypeId.placeholder',
      type: 'select',
    },
  },
};
