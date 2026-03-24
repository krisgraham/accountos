import { z } from 'zod';
import { PaginationSchema } from './common';

export const CreateDepartmentSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  colorCode: z.string().max(20).optional(),
  missionFocus: z.string().optional(),
  strategicPriorities: z.string().optional(),
  budgetCycleStart: z.string().datetime().optional(),
  budgetCycleEnd: z.string().datetime().optional(),
  keyInitiatives: z.string().optional(),
  organizationId: z.string().uuid(),
});

export const UpdateDepartmentSchema = CreateDepartmentSchema.partial();

export const DepartmentListQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  organizationId: z.string().uuid().optional(),
});

export type CreateDepartment = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartment = z.infer<typeof UpdateDepartmentSchema>;
export type DepartmentListQuery = z.infer<typeof DepartmentListQuerySchema>;
