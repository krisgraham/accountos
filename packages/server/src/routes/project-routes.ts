import { Router } from 'express';
import { prisma } from '@accountos/prisma';
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  ProjectListQuerySchema,
  AddProjectMemberSchema,
  UpdateProjectMemberSchema,
} from '@accountos/shared';
import { ZodError } from 'zod';

const projectRouter = Router();

projectRouter.get('/projects', async (req, res) => {
  try {
    const query = ProjectListQuerySchema.parse(req.query);
    const { page, limit, search, organizationId, type, healthStatus, contractStatus, sort, order } = query;

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.name = { contains: search };
    if (organizationId) where.organizationId = organizationId;
    if (type) where.type = type;
    if (healthStatus) where.healthStatus = healthStatus;
    if (contractStatus) where.contractStatus = contractStatus;

    const orderBy: Record<string, string> = {};
    if (sort === 'estimatedValue') orderBy.estimatedValue = order || 'desc';
    else if (sort === 'createdAt') orderBy.createdAt = order || 'desc';
    else orderBy.name = order || 'asc';

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          organization: { select: { id: true, name: true } },
          department: { select: { id: true, name: true } },
          _count: { select: { members: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.get('/projects/:id', async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: {
        organization: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
        members: {
          include: {
            contact: {
              select: { id: true, name: true, title: true, stakeholderRole: true, sentiment: true },
            },
          },
        },
        meetingNotes: { orderBy: { date: 'desc' }, take: 5 },
        actionItems: { orderBy: { createdAt: 'desc' } },
        nextSteps: { orderBy: { date: 'asc' } },
      },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.post('/projects', async (req, res) => {
  try {
    const data = CreateProjectSchema.parse(req.body);
    const project = await prisma.project.create({
      data,
      include: { organization: { select: { id: true, name: true } } },
    });
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.put('/projects/:id', async (req, res) => {
  try {
    const data = UpdateProjectSchema.parse(req.body);
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });
    res.json(project);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.delete('/projects/:id', async (req, res) => {
  try {
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    await prisma.project.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.get('/projects/:id/members', async (req, res) => {
  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId: req.params.id },
      include: {
        contact: {
          select: { id: true, name: true, title: true, stakeholderRole: true, sentiment: true },
        },
      },
    });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.post('/projects/:id/members', async (req, res) => {
  try {
    const { engagementRoles, ...rest } = AddProjectMemberSchema.parse(req.body);
    const member = await prisma.projectMember.create({
      data: {
        ...rest,
        projectId: req.params.id,
        engagementRoles: engagementRoles ? JSON.stringify(engagementRoles) : null,
      },
      include: {
        contact: {
          select: { id: true, name: true, title: true, stakeholderRole: true, sentiment: true },
        },
      },
    });
    res.status(201).json({
      ...member,
      engagementRoles: member.engagementRoles ? JSON.parse(member.engagementRoles) : [],
    });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.put('/project-members/:id/engagement-roles', async (req, res) => {
  try {
    const data = UpdateProjectMemberSchema.parse(req.body);
    const member = await prisma.projectMember.update({
      where: { id: req.params.id },
      data: {
        ...(data.role !== undefined && { role: data.role }),
        ...(data.engagementRoles !== undefined && {
          engagementRoles: JSON.stringify(data.engagementRoles),
        }),
      },
      include: {
        contact: {
          select: { id: true, name: true, title: true, stakeholderRole: true, sentiment: true },
        },
      },
    });
    res.json({
      ...member,
      engagementRoles: member.engagementRoles ? JSON.parse(member.engagementRoles) : [],
    });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.delete('/projects/:projectId/members/:memberId', async (req, res) => {
  try {
    await prisma.projectMember.delete({ where: { id: req.params.memberId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { projectRouter };
