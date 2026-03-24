import { z } from 'zod';
import { PaginationSchema, HealthStatus } from './common';

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1).max(200),
  industry: z.string().max(200).optional(),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  healthStatus: HealthStatus.optional(),
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

export const OrganizationListQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  healthStatus: HealthStatus.optional(),
});

export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;
export type OrganizationListQuery = z.infer<typeof OrganizationListQuerySchema>;
