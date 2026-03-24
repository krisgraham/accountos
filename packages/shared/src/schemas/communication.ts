import { z } from 'zod';
import { PaginationSchema, CommunicationType, Sentiment } from './common';

export const CreateCommunicationSchema = z.object({
  type: CommunicationType,
  date: z.string().datetime().optional(),
  summary: z.string().optional(),
  detail: z.string().optional(),
  sentiment: Sentiment.optional(),
  participantIds: z.array(z.string().uuid()).min(1),
  projectIds: z.array(z.string().uuid()).optional(),
});

export const UpdateCommunicationSchema = z.object({
  type: CommunicationType.optional(),
  date: z.string().datetime().optional(),
  summary: z.string().optional(),
  detail: z.string().optional(),
  sentiment: Sentiment.optional(),
});

export const CommunicationListQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  type: CommunicationType.optional(),
  contactId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sort: z.enum(['date', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type CreateCommunication = z.infer<typeof CreateCommunicationSchema>;
export type UpdateCommunication = z.infer<typeof UpdateCommunicationSchema>;
export type CommunicationListQuery = z.infer<typeof CommunicationListQuerySchema>;
