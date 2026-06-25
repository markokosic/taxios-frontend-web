import { z } from 'zod';

export type ApiResponse<T = null> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiSuccessResponse<T = null> = {
  statusCode: number;
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  statusCode: number;
  success: false;
  message: string;
  errors?: any; // Typ je nach Fehlerstruktur, z.B. string[] oder ValidationError[]
};

//TODO REFACTOR EXISTING, maybe refactor all into ZOD schema from this file
export type PaginatedList<T = any[]> = {
  content: T;
  first: boolean;
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export const createPageResponseSchema = <T extends z.ZodTypeAny>(contentSchema: T) =>
  z.object({
    content: z.array(contentSchema),
    page: z.number().int(),
    size: z.number().int(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
    first: z.boolean(),
    last: z.boolean(),
  });
