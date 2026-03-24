import { z } from 'zod';
import {
  PaginationSchema,
  StakeholderRole,
  Sentiment,
  InfluenceLevel,
  EngagementStatus,
} from './common';

export const CreateContactSchema = z.object({
  name: z.string().min(1).max(200),
  title: z.string().max(200).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  background: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  organizationId: z.string().uuid(),
  departmentId: z.string().uuid().nullable().optional(),
  reportsToId: z.string().uuid().nullable().optional(),
  stakeholderRole: StakeholderRole.optional(),
  sentiment: Sentiment.optional(),
  influenceLevel: InfluenceLevel.optional(),
  engagementStatus: EngagementStatus.optional(),
  engagementStatusNote: z.string().optional(),
  isKeyStakeholder: z.boolean().optional(),
  ourGoals: z.string().optional(),
});

export const UpdateContactSchema = CreateContactSchema.partial();

export const ContactListQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  organizationId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  stakeholderRole: StakeholderRole.optional(),
  sentiment: Sentiment.optional(),
  influenceLevel: InfluenceLevel.optional(),
  engagementStatus: EngagementStatus.optional(),
  isKeyStakeholder: z.coerce.boolean().optional(),
  sort: z.enum(['name', 'lastContact', 'relationshipScore', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type CreateContact = z.infer<typeof CreateContactSchema>;
export type UpdateContact = z.infer<typeof UpdateContactSchema>;
export type ContactListQuery = z.infer<typeof ContactListQuerySchema>;
