import { Router } from 'express';
import { prisma } from '@accountos/prisma';
import {
  CreateCommunicationSchema,
  UpdateCommunicationSchema,
  CommunicationListQuerySchema,
} from '@accountos/shared';
import { ZodError } from 'zod';

const communicationRouter = Router();

communicationRouter.get('/communications', async (req, res) => {
  try {
    const query = CommunicationListQuerySchema.parse(req.query);
    const { page, limit, search, type, contactId, projectId, dateFrom, dateTo, sort, order } = query;

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.summary = { contains: search };
    if (type) where.type = type;
    if (contactId) where.participants = { some: { contactId } };
    if (projectId) where.projects = { some: { projectId } };
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
      prisma.communication.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          participants: {
            include: { contact: { select: { id: true, name: true, title: true } } },
          },
          projects: {
            include: { project: { select: { id: true, name: true } } },
          },
        },
      }),
      prisma.communication.count({ where }),
    ]);

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

communicationRouter.get('/communications/:id', async (req, res) => {
  try {
    const comm = await prisma.communication.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: {
        participants: {
          include: { contact: { select: { id: true, name: true, title: true } } },
        },
        projects: {
          include: { project: { select: { id: true, name: true } } },
        },
      },
    });
    if (!comm) return res.status(404).json({ error: 'Communication not found' });
    res.json(comm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

communicationRouter.post('/communications', async (req, res) => {
  try {
    const { participantIds, projectIds, ...data } = CreateCommunicationSchema.parse(req.body);

    const comm = await prisma.communication.create({
      data: {
        ...data,
        participants: {
          create: participantIds.map((contactId) => ({ contactId })),
        },
        ...(projectIds?.length && {
          projects: {
            create: projectIds.map((projectId) => ({ projectId })),
          },
        }),
      },
      include: {
        participants: {
          include: { contact: { select: { id: true, name: true } } },
        },
        projects: {
          include: { project: { select: { id: true, name: true } } },
        },
      },
    });
    res.status(201).json(comm);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

communicationRouter.put('/communications/:id', async (req, res) => {
  try {
    const data = UpdateCommunicationSchema.parse(req.body);
    const existing = await prisma.communication.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Communication not found' });

    const comm = await prisma.communication.update({
      where: { id: req.params.id },
      data,
    });
    res.json(comm);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { communicationRouter };
