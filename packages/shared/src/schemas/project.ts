import { z } from 'zod';
import { PaginationSchema, ProjectType, HealthStatus, ContractStatus, EngagementRole } from './common';

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  type: ProjectType,
  stage: z.string().max(100).optional(),
  healthStatus: HealthStatus.optional(),
  contractStatus: ContractStatus.optional(),
  estimatedValue: z.number().nonnegative().optional(),
  winLikelihood: z.number().int().min(0).max(100).nullable().optional(),
  organizationId: z.string().uuid(),
  departmentId: z.string().uuid().nullable().optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const ProjectListQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  organizationId: z.string().uuid().optional(),
  type: ProjectType.optional(),
  healthStatus: HealthStatus.optional(),
  contractStatus: ContractStatus.optional(),
  sort: z.enum(['name', 'estimatedValue', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const AddProjectMemberSchema = z.object({
  contactId: z.string().uuid(),
  role: z.string().min(1).max(100),
  engagementRoles: z.array(EngagementRole).optional(),
});

export const UpdateProjectMemberSchema = z.object({
  role: z.string().min(1).max(100).optional(),
  engagementRoles: z.array(EngagementRole).optional(),
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type ProjectListQuery = z.infer<typeof ProjectListQuerySchema>;
export type AddProjectMember = z.infer<typeof AddProjectMemberSchema>;
export type UpdateProjectMember = z.infer<typeof UpdateProjectMemberSchema>;
