import { DriverResponse, DriverSelect, DriverSummary } from '@/api/generated/model';

export interface DriverOption {
  value: string;
  label: string;
  id?: number;
}

export type AnyDriver = DriverSelect | DriverSummary | DriverResponse;

export const formatDriverLabel = (driver: AnyDriver): string => {
  if ('fullName' in driver && driver.fullName) {
    return driver.fullName;
  }
  const first = 'firstName' in driver ? driver.firstName : '';
  const last = 'lastName' in driver ? driver.lastName : '';
  return `${first || ''} ${last || ''}`.trim();
};

export const mapDriversToOptions = (
  drivers?: AnyDriver | (AnyDriver | null | undefined)[] | null
): DriverOption[] => {
  if (!drivers) {
    return [];
  }
  const list = Array.isArray(drivers) ? drivers : [drivers];

  return list
    .filter((driver): driver is AnyDriver => driver != null && driver.id != null)
    .map((driver) => ({
      value: String(driver.id),
      label: formatDriverLabel(driver),
      id: driver.id,
    }));
};

/** @deprecated Use mapDriversToOptions instead */
export const mapDriverSummaryToOption = (driver?: DriverSummary | null): DriverOption[] => {
  return mapDriversToOptions(driver);
};

export const mapDriversToComboboxOptions = (drivers: DriverSelect[]) => {
  return drivers.map((driver) => ({
    value: driver.id!,
    label: driver.fullName!,
  }));
};
