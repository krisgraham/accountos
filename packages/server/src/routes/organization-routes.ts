import { Router } from 'express';
import { prisma } from '@accountos/prisma';
import {
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
  OrganizationListQuerySchema,
} from '@accountos/shared';
import { ZodError } from 'zod';

const organizationRouter = Router();

organizationRouter.get('/organizations', async (req, res) => {
  try {
    const { page, limit, search, healthStatus } = OrganizationListQuerySchema.parse(req.query);
    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.name = { contains: search };
    if (healthStatus) where.healthStatus = healthStatus;

    const [data, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { contacts: true, departments: true, projects: true } },
        },
      }),
      prisma.organization.count({ where }),
    ]);

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

organizationRouter.get('/organizations/:id', async (req, res) => {
  try {
    const org = await prisma.organization.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: {
        departments: { where: { deletedAt: null } },
        _count: { select: { contacts: true, projects: true } },
      },
    });
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json(org);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

organizationRouter.post('/organizations', async (req, res) => {
  try {
    const data = CreateOrganizationSchema.parse(req.body);
    const org = await prisma.organization.create({ data });
    res.status(201).json(org);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

organizationRouter.put('/organizations/:id', async (req, res) => {
  try {
    const data = UpdateOrganizationSchema.parse(req.body);
    const existing = await prisma.organization.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Organization not found' });

    const org = await prisma.organization.update({
      where: { id: req.params.id },
      data,
    });
    res.json(org);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

organizationRouter.delete('/organizations/:id', async (req, res) => {
  try {
    const existing = await prisma.organization.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Organization not found' });

    await prisma.organization.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

organizationRouter.get('/organizations/:id/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { organizationId: req.params.id, deletedAt: null },
      include: { department: true },
      orderBy: { name: 'asc' },
    });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

organizationRouter.get('/organizations/:id/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { organizationId: req.params.id, deletedAt: null },
      include: { _count: { select: { contacts: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

organizationRouter.get('/organizations/:id/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { organizationId: req.params.id, deletedAt: null },
      include: { _count: { select: { members: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { organizationRouter };
