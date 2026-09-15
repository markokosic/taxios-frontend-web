import { TFunction } from 'i18next';
import { z } from 'zod';

export const getDriverCreateShiftSchema = (t: TFunction) =>
  z
    .object({
      carId: z.number({
        message: t('errors:shifts.carId.required', 'Bitte wählen Sie ein Fahrzeug aus'),
      }),
      shiftStart: z
        .string()
        .min(1, t('errors:shifts.shiftStart.required', 'Bitte geben Sie den Schichtbeginn an')),
      shiftEnd: z
        .string()
        .min(1, t('errors:shifts.shiftEnd.required', 'Bitte geben Sie das Schichtende an')),
      odometerStart: z
        .number({
          message: t('errors:shifts.odometerStart.required', 'Tachostand Beginn ist erforderlich'),
        })
        .min(0, t('errors:shifts.odometerStart.invalid', 'Ungültiger Tachostand')),
      odometerEnd: z
        .number({
          message: t('errors:shifts.odometerEnd.required', 'Tachostand Ende ist erforderlich'),
        })
        .min(0, t('errors:shifts.odometerEnd.invalid', 'Ungültiger Tachostand')),
      singleRides: z.array(z.number()).default([]),
      flatRateCounts: z.record(z.string(), z.number()).default({}),
      flatRatePrices: z.record(z.string(), z.number()).optional().default({}),
      weeklyRentPaid: z.number().optional().nullable(),
    })
    .refine((data) => data.odometerEnd >= data.odometerStart, {
      message: t('errors:shifts.odometerEnd.must_be_greater', 'Tachostand Ende muss >= Tachostand Beginn sein'),
      path: ['odometerEnd'],
    });

export type DriverCreateShiftFormValues = z.infer<ReturnType<typeof getDriverCreateShiftSchema>>;
