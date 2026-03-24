import { Router } from 'express';
import { prisma } from '@accountos/prisma';
import {
  CreateTeamMemberSchema,
  UpdateTeamMemberSchema,
  TeamMemberListQuerySchema,
  CreateLinkSchema,
} from '@accountos/shared';
import { ZodError } from 'zod';

const teamMemberRouter = Router();

teamMemberRouter.get('/team-members', async (req, res) => {
  try {
    const { page, limit, search } = TeamMemberListQuerySchema.parse(req.query);
    const where: Record<string, unknown> = {};
    if (search) where.name = { contains: search };

    const [data, total] = await Promise.all([
      prisma.teamMember.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: { _count: { select: { affinities: true } } },
      }),
      prisma.teamMember.count({ where }),
    ]);

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

teamMemberRouter.get('/team-members/:id', async (req, res) => {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: req.params.id },
      include: {
        affinities: {
          include: { contact: { select: { id: true, name: true, title: true } } },
        },
      },
    });
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

teamMemberRouter.post('/team-members', async (req, res) => {
  try {
    const data = CreateTeamMemberSchema.parse(req.body);
    const member = await prisma.teamMember.create({ data });
    res.status(201).json(member);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

teamMemberRouter.put('/team-members/:id', async (req, res) => {
  try {
    const data = UpdateTeamMemberSchema.parse(req.body);
    const member = await prisma.teamMember.update({
      where: { id: req.params.id },
      data,
    });
    res.json(member);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Links (polymorphic)
teamMemberRouter.post('/links', async (req, res) => {
  try {
    const data = CreateLinkSchema.parse(req.body);
    const link = await prisma.link.create({ data });
    res.status(201).json(link);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

teamMemberRouter.delete('/links/:id', async (req, res) => {
  try {
    await prisma.link.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { teamMemberRouter };
