export const REMUNERATION_FORM_FIELDS = {
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

  fixedPerShift: {
    driverPayoutPerShift: {
      name: 'driverPayoutPerShift',
      labelKey: 'common:form.driverPayoutPerShift.label',
      placeholderKey: 'common:form.driverPayoutPerShift.placeholder',
      type: 'number',
    },
  },
};
