import { z } from 'zod';
import { PaginationSchema, DesireCategory, RelationshipIntelCategory } from './common';

export const CreateDesireSchema = z.object({
  category: DesireCategory,
  description: z.string().min(1),
  contactId: z.string().uuid(),
});

export const CreateRelationshipIntelSchema = z.object({
  category: RelationshipIntelCategory,
  description: z.string().min(1),
  contactId: z.string().uuid(),
});

export const CreateEngagementStrategySchema = z.object({
  title: z.string().min(1).max(200),
  narrative: z.string().optional(),
  contactId: z.string().uuid(),
});

export const UpdateEngagementStrategySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  narrative: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'SUPERSEDED']).optional(),
});

export const CreateNextStepSchema = z.object({
  type: z.enum(['MEETING', 'CALL', 'EMAIL', 'OTHER']),
  date: z.string().datetime().optional(),
  notes: z.string().optional(),
  contactId: z.string().uuid(),
  projectId: z.string().uuid().nullable().optional(),
  engagementStrategyId: z.string().uuid().nullable().optional(),
});

export const UpdateNextStepSchema = z.object({
  type: z.enum(['MEETING', 'CALL', 'EMAIL', 'OTHER']).optional(),
  date: z.string().datetime().nullable().optional(),
  notes: z.string().optional(),
  status: z.enum(['PLANNED', 'COMPLETED', 'CANCELLED']).optional(),
});

export const NextStepListQuerySchema = PaginationSchema.extend({
  contactId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  status: z.enum(['PLANNED', 'COMPLETED', 'CANCELLED']).optional(),
});

export const CreateLinkSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url(),
  typeTag: z.string().max(50).optional(),
  entityType: z.string().min(1),
  entityId: z.string().uuid(),
});

export const CreateTeamMemberSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().max(200).optional(),
  expertiseAreas: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export const UpdateTeamMemberSchema = CreateTeamMemberSchema.partial();

export const TeamMemberListQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
});

export type CreateDesire = z.infer<typeof CreateDesireSchema>;
export type CreateRelationshipIntel = z.infer<typeof CreateRelationshipIntelSchema>;
export type CreateEngagementStrategy = z.infer<typeof CreateEngagementStrategySchema>;
export type UpdateEngagementStrategy = z.infer<typeof UpdateEngagementStrategySchema>;
export type CreateNextStep = z.infer<typeof CreateNextStepSchema>;
export type UpdateNextStep = z.infer<typeof UpdateNextStepSchema>;
export type NextStepListQuery = z.infer<typeof NextStepListQuerySchema>;
export type CreateLink = z.infer<typeof CreateLinkSchema>;
export type CreateTeamMember = z.infer<typeof CreateTeamMemberSchema>;
export type UpdateTeamMember = z.infer<typeof UpdateTeamMemberSchema>;
export type TeamMemberListQuery = z.infer<typeof TeamMemberListQuerySchema>;
