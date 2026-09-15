import { CarResponse, CarSummary } from '@/api/generated/model';

export interface CarOption {
  value: string;
  label: string;
  id?: number;
}

export type AnyCar = CarResponse | CarSummary;

export const formatCarLabel = (car: AnyCar): string => {
  return `${car.licensePlate || ''} ${car.model || ''} ${car.brand || ''}`.trim();
};

export const mapCarsToOptions = (
  cars?: AnyCar | (AnyCar | null | undefined)[] | null
): CarOption[] => {
  if (!cars) {
    return [];
  }
  const list = Array.isArray(cars) ? cars : [cars];

  return list
    .filter((car): car is AnyCar => car != null && car.id != null)
    .map((car) => ({
      value: String(car.id),
      label: formatCarLabel(car),
      id: car.id,
    }));
};

