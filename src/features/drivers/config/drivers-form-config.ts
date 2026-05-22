// import { zodResolver } from '@hookform/resolvers/zod';
// import { TFunction } from 'i18next';
// import { FieldValues, Resolver } from 'react-hook-form';
// import { getCreateDriverSchema } from '../drivers-schemas';
// import { CreateDriverRequest, Driver } from '../drivers-types';
// import { DRIVERS_FORM_FIELDS } from './drivers-form-fields';

// export interface DriverFormConfig<T extends FieldValues> {
//   getResolver: (t: TFunction) => Resolver<T>;
//   getFields: (args: { isReadOnly: boolean; role?: string }) => any[];
//   mapper: (data: any) => Partial<CreateDriverRequest>;
//   getDefaultValues: (customer: T) => T;
// }

// export const CREATE_DRIVER_FORM_CONFIG: DriverFormConfig<Driver> = {
//   getResolver: (t) => zodResolver(getCreateDriverSchema(t)),
//   getFields: () => [
//     {
//       groupName: 'form:groups.general_information',
//       layout: { desktop: { columns: 2 }, mobile: { columns: 1 } },
//       fields: [{ ...DRIVERS_FORM_FIELDS.common }],
//     },
//   ],
//   mapper: (data) =>
// };


// export const ADD_CUSTOMER_FORM_CONFIG: AddCustomerFormConfigMap = {
//   [CustomerType.BUSINESS]: {
//     getResolver: (t) => zodResolver(getBusinessAddSchema(t)),
//     getFields: () => [
//       {
//         groupName: 'form:groups.general_information',
//         layout: { desktop: { columns: 2 }, mobile: { columns: 1 } },
//         fields: [
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.BUSINESS].companyName },
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.BUSINESS].vat },
//         ],
//       },
//       {
//         groupName: 'form:groups.contact',
//         layout: { desktop: { columns: 3 }, mobile: { columns: 1 } },
//         fields: [
//           { ...CUSTOMER_FORM_FIELDS.common.email },
//           { ...CUSTOMER_FORM_FIELDS.common.phone },
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.BUSINESS].website },
//         ],
//       },
//     ],
//     mapper: (data, type) => mapBusinessCustomerToAddDTO(data, type),
//     getDefaultValues: () => ({
//       type: CustomerType.BUSINESS,
//       companyName: '',
//       vat: '',
//       email: '',
//       website: '',
//       phone: '',
//     }),
//   },
//   [CustomerType.CONSUMER]: {
//     getResolver: (t) => zodResolver(getConsumerAddSchema(t)),
//     getFields: () => [
//       {
//         groupName: 'form:groups.general_information',
//         layout: { desktop: { columns: 2 }, mobile: { columns: 1 } },
//         fields: [
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.CONSUMER].firstName },
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.CONSUMER].lastName },
//         ],
//       },
//       {
//         groupName: 'form:groups.contact',
//         layout: { desktop: { columns: 2 }, mobile: { columns: 1 } },
//         fields: [
//           { ...CUSTOMER_FORM_FIELDS.common.email },
//           { ...CUSTOMER_FORM_FIELDS.common.phone },
//         ],
//       },
//     ],
//     mapper: (data, type) => mapConsumerCustomerToAddDTO(data, type),
//     getDefaultValues: () => ({
//       type: CustomerType.CONSUMER,
//       firstName: '',
//       lastName: '',
//       phone: '',
//       email: '',
//     }),
//   },
// };














// //EXISTING CUSTOMER

// export const VIEW_AND_EDIT_CUSTOMER_FORM_CONFIG: EditCustomerFormConfigMap = {
//   [CustomerType.BUSINESS]: {
//     getResolver: (t) => zodResolver(getBusinessUpdateSchema(t)),
//     getFields: ({ isReadOnly }) => [
//       {
//         groupName: 'form:groups.general_information',
//         layout: { desktop: { columns: 2 }, mobile: { columns: 1 } },
//         fields: [
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.BUSINESS].companyName, isDisabled: isReadOnly },
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.BUSINESS].vat, isDisabled: isReadOnly },
//         ],
//       },
//       {
//         groupName: 'form:groups.contact',
//         layout: { desktop: { columns: 3 }, mobile: { columns: 1 } },
//         fields: [
//           { ...CUSTOMER_FORM_FIELDS.common.email, isDisabled: isReadOnly },
//           { ...CUSTOMER_FORM_FIELDS.common.phone, isDisabled: isReadOnly },
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.BUSINESS].website, isDisabled: isReadOnly },
//         ],
//       },
//     ],
//     mapper: mapBusinessCustomerToUpdateDTO,
//     getDefaultValues: (customer: UpdateBusinessCustomer) => ({
//       ...customer,
//     }),
//   },
//   [CustomerType.CONSUMER]: {
//     getResolver: (t) => zodResolver(getConsumerUpdateSchema(t)),
//     getFields: ({ isReadOnly }) => [
//       {
//         groupName: 'form:groups.general_information',
//         layout: { desktop: { columns: 2 }, mobile: { columns: 1 } },
//         fields: [
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.CONSUMER].firstName, isDisabled: isReadOnly },
//           { ...CUSTOMER_FORM_FIELDS[CustomerType.CONSUMER].lastName, isDisabled: isReadOnly },
//         ],
//       },
//       {
//         groupName: 'form:groups.contact',
//         layout: { desktop: { columns: 2 }, mobile: { columns: 1 } },
//         fields: [
//           { ...CUSTOMER_FORM_FIELDS.common.email, isDisabled: isReadOnly },
//           { ...CUSTOMER_FORM_FIELDS.common.phone, isDisabled: isReadOnly },
//         ],
//       },
//     ],
//     mapper: mapConsumerCustomerToUpdateDTO,
//     getDefaultValues: (customer: UpdateConsumerCustomer) => ({
//       ...customer,
//     }),
//   },

// };

// export interface AddCustomerFormConfig<T extends FieldValues, D, TY> {
//   getResolver: (t: TFunction) => Resolver<T>;
//   getFields: () => any[];
//   mapper: (data: D, type: TY) => any;
//   getDefaultValues: () => T;
// }

// export type AddCustomerFormConfigMap = {
//   [CustomerType.BUSINESS]: AddCustomerFormConfig<
//     AddBusinessCustomer,
//     BusinessData,
//     CustomerType.BUSINESS
//   >;
//   [CustomerType.CONSUMER]: AddCustomerFormConfig<
//     AddConsumerCustomer,
//     ConsumerData,
//     CustomerType.CONSUMER
//   >;
// };


