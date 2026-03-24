import { z } from 'zod';
import { PaginationSchema } from './common';

export const CreatePersonNoteSchema = z.object({
  contactId: z.string().uuid(),
  wants: z.string().optional(),
  reactions: z.string().optional(),
  commitments: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdatePersonNoteSchema = CreatePersonNoteSchema.partial().omit({ contactId: true });

export const CreateMeetingNoteSchema = z.object({
  date: z.string().datetime().optional(),
  meetingType: z.string().max(100).optional(),
  summary: z.string().optional(),
  rawText: z.string().optional(),
  projectId: z.string().uuid().nullable().optional(),
  attendeeIds: z.array(z.string().uuid()).optional(),
  personNotes: z.array(CreatePersonNoteSchema).optional(),
});

export const UpdateMeetingNoteSchema = z.object({
  date: z.string().datetime().optional(),
  meetingType: z.string().max(100).optional(),
  summary: z.string().optional(),
  rawText: z.string().optional(),
  projectId: z.string().uuid().nullable().optional(),
});

export const MeetingNoteListQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  projectId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sort: z.enum(['date', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const CreateActionItemSchema = z.object({
  description: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  meetingNoteId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
});

export const UpdateActionItemSchema = z.object({
  description: z.string().min(1).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']).optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

export type CreateMeetingNote = z.infer<typeof CreateMeetingNoteSchema>;
export type UpdateMeetingNote = z.infer<typeof UpdateMeetingNoteSchema>;
export type MeetingNoteListQuery = z.infer<typeof MeetingNoteListQuerySchema>;
export type CreatePersonNote = z.infer<typeof CreatePersonNoteSchema>;
export type UpdatePersonNote = z.infer<typeof UpdatePersonNoteSchema>;
export type CreateActionItem = z.infer<typeof CreateActionItemSchema>;
export type UpdateActionItem = z.infer<typeof UpdateActionItemSchema>;
