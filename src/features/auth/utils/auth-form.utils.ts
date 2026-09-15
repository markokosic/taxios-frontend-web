import { RegisterMutationBody } from '@/api/generated/endpoints/authentication/authentication';


export const mapRegisterFormToMutationBody = (
  data: RegisterMutationBody
): RegisterMutationBody => ({
  tenantName: data.tenantName,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  password: data.password,
});
