import { UserResponseRoles } from '@/api/generated/model';
import { useAuth } from './useAuth';

export const useUserHasRole = (allowedRoles?: UserResponseRoles[] | UserResponseRoles): boolean => {
  const { user } = useAuth();

  if (!allowedRoles) {
    return true;
  }

  const userRole = user?.role as UserResponseRoles | undefined;

  if (!userRole) {
    return false;
  }

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (rolesArray.length === 0) {
    return true;
  }

  return rolesArray.includes(userRole);
};

export const useUserRole = () => {
  const { user } = useAuth();
  const role = user?.role as UserResponseRoles | undefined;
  const mustChangePassword = Boolean(user?.mustChangePassword);

  return {
    role,
    mustChangePassword,
    isDriver: role === UserResponseRoles.DRIVER,
    isAdmin: role === UserResponseRoles.ADMIN,
    isOwner: role === UserResponseRoles.OWNER,
    isBackoffice: role === UserResponseRoles.BACKOFFICE,
  };
};
