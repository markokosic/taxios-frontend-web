export const DAYS_OF_THE_WEEK = [
  { value: 1, label: 'common:days.monday' },
  { value: 2, label: 'common:days.tuesday' },
  { value: 3, label: 'common:days.wednesday' },
  { value: 4, label: 'common:days.thursday' },
  { value: 5, label: 'common:days.friday' },
  { value: 6, label: 'common:days.saturday' },
  { value: 7, label: 'common:days.sunday' },
] as const;

export type DayOfWeek = (typeof DAYS_OF_THE_WEEK)[number];
