import { Router } from 'express';
import { prisma } from '@accountos/prisma';
import {
  CreateMeetingNoteSchema,
  UpdateMeetingNoteSchema,
  MeetingNoteListQuerySchema,
  CreatePersonNoteSchema,
  UpdatePersonNoteSchema,
  CreateActionItemSchema,
  UpdateActionItemSchema,
} from '@accountos/shared';
import { ZodError } from 'zod';

const meetingNoteRouter = Router();

meetingNoteRouter.get('/meeting-notes', async (req, res) => {
  try {
    const query = MeetingNoteListQuerySchema.parse(req.query);
    const { page, limit, search, projectId, contactId, dateFrom, dateTo, sort, order } = query;

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.summary = { contains: search };
    if (projectId) where.projectId = projectId;
    if (contactId) where.attendees = { some: { contactId } };
    if (dateFrom || dateTo) {
      const dateFilter: Record<string, string> = {};
      if (dateFrom) dateFilter.gte = dateFrom;
      if (dateTo) dateFilter.lte = dateTo;
      where.date = dateFilter;
    }

    const orderBy: Record<string, string> = {};
    if (sort === 'date') orderBy.date = order || 'desc';
    else orderBy.date = 'desc';

    const [data, total] = await Promise.all([
      prisma.meetingNote.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          project: { select: { id: true, name: true } },
          attendees: {
            include: { contact: { select: { id: true, name: true, title: true } } },
          },
          _count: { select: { actionItems: true, personNotes: true } },
        },
      }),
      prisma.meetingNote.count({ where }),
    ]);

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

meetingNoteRouter.get('/meeting-notes/:id', async (req, res) => {
  try {
    const note = await prisma.meetingNote.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: {
        project: { select: { id: true, name: true } },
        attendees: {
          include: { contact: { select: { id: true, name: true, title: true } } },
        },
        personNotes: {
          include: { contact: { select: { id: true, name: true } } },
        },
        actionItems: {
          include: { assignee: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!note) return res.status(404).json({ error: 'Meeting note not found' });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

meetingNoteRouter.post('/meeting-notes', async (req, res) => {
  try {
    const { attendeeIds, personNotes, ...data } = CreateMeetingNoteSchema.parse(req.body);

    const note = await prisma.meetingNote.create({
      data: {
        ...data,
        ...(attendeeIds?.length && {
          attendees: {
            create: attendeeIds.map((contactId) => ({ contactId })),
          },
        }),
        ...(personNotes?.length && {
          personNotes: {
            create: personNotes,
          },
        }),
      },
      include: {
        attendees: {
          include: { contact: { select: { id: true, name: true } } },
        },
        personNotes: true,
      },
    });
    res.status(201).json(note);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

meetingNoteRouter.put('/meeting-notes/:id', async (req, res) => {
  try {
    const data = UpdateMeetingNoteSchema.parse(req.body);
    const existing = await prisma.meetingNote.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Meeting note not found' });

    const note = await prisma.meetingNote.update({
      where: { id: req.params.id },
      data,
    });
    res.json(note);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

meetingNoteRouter.post('/meeting-notes/:id/person-notes', async (req, res) => {
  try {
    const data = CreatePersonNoteSchema.parse(req.body);
    const personNote = await prisma.personNote.create({
      data: { ...data, meetingNoteId: req.params.id },
      include: { contact: { select: { id: true, name: true } } },
    });
    res.status(201).json(personNote);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

meetingNoteRouter.put('/person-notes/:id', async (req, res) => {
  try {
    const data = UpdatePersonNoteSchema.parse(req.body);
    const personNote = await prisma.personNote.update({
      where: { id: req.params.id },
      data,
    });
    res.json(personNote);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

meetingNoteRouter.post('/meeting-notes/:id/action-items', async (req, res) => {
  try {
    const data = CreateActionItemSchema.parse(req.body);
    const item = await prisma.actionItem.create({
      data: { ...data, meetingNoteId: req.params.id },
      include: { assignee: { select: { id: true, name: true } } },
    });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

meetingNoteRouter.put('/action-items/:id', async (req, res) => {
  try {
    const data = UpdateActionItemSchema.parse(req.body);
    const item = await prisma.actionItem.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { meetingNoteRouter };
