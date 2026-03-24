import { Router } from 'express';
import { prisma } from '@accountos/prisma';
import {
  CreateContactSchema,
  UpdateContactSchema,
  ContactListQuerySchema,
  CreateDesireSchema,
  CreateRelationshipIntelSchema,
  CreateEngagementStrategySchema,
  UpdateEngagementStrategySchema,
  CreateNextStepSchema,
  UpdateNextStepSchema,
} from '@accountos/shared';
import { ZodError } from 'zod';

const contactRouter = Router();

contactRouter.get('/contacts', async (req, res) => {
  try {
    const query = ContactListQuerySchema.parse(req.query);
    const { page, limit, search, organizationId, departmentId, stakeholderRole, sentiment, influenceLevel, engagementStatus, sort, order } = query;

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.name = { contains: search };
    if (organizationId) where.organizationId = organizationId;
    if (departmentId) where.departmentId = departmentId;
    if (stakeholderRole) where.stakeholderRole = stakeholderRole;
    if (sentiment) where.sentiment = sentiment;
    if (influenceLevel) where.influenceLevel = influenceLevel;
    if (engagementStatus) where.engagementStatus = engagementStatus;
    if (query.isKeyStakeholder) where.isKeyStakeholder = true;

    const orderBy: Record<string, string> = {};
    if (sort === 'name') orderBy.name = order || 'asc';
    else if (sort === 'relationshipScore') orderBy.relationshipScore = order || 'desc';
    else if (sort === 'createdAt') orderBy.createdAt = order || 'desc';
    else orderBy.name = 'asc';

    const [data, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          department: true,
          organization: { select: { id: true, name: true } },
        },
      }),
      prisma.contact.count({ where }),
    ]);

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: {
        department: true,
        organization: { select: { id: true, name: true } },
        reportsTo: { select: { id: true, name: true, title: true } },
        directReports: {
          where: { deletedAt: null },
          select: { id: true, name: true, title: true, stakeholderRole: true },
        },
        desires: { orderBy: { date: 'desc' } },
        relationshipIntels: { orderBy: { date: 'desc' } },
        engagementStrategies: {
          orderBy: { createdAt: 'desc' },
          include: { nextSteps: { orderBy: { date: 'asc' } } },
        },
        nextSteps: {
          where: { engagementStrategyId: null },
          orderBy: { date: 'asc' },
        },
        projectMembers: {
          include: { project: { select: { id: true, name: true, type: true } } },
        },
      },
    });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.post('/contacts', async (req, res) => {
  try {
    const data = CreateContactSchema.parse(req.body);
    const org = await prisma.organization.findFirst({
      where: { id: data.organizationId, deletedAt: null },
    });
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const contact = await prisma.contact.create({
      data,
      include: { department: true, organization: { select: { id: true, name: true } } },
    });
    res.status(201).json(contact);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.put('/contacts/:id', async (req, res) => {
  try {
    const data = UpdateContactSchema.parse(req.body);
    const existing = await prisma.contact.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Contact not found' });

    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data,
      include: { department: true, organization: { select: { id: true, name: true } } },
    });
    res.json(contact);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.delete('/contacts/:id', async (req, res) => {
  try {
    const existing = await prisma.contact.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Contact not found' });

    await prisma.contact.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.get('/contacts/:id/communications', async (req, res) => {
  try {
    const communications = await prisma.communication.findMany({
      where: {
        deletedAt: null,
        participants: { some: { contactId: req.params.id } },
      },
      include: {
        participants: { include: { contact: { select: { id: true, name: true } } } },
        projects: { include: { project: { select: { id: true, name: true } } } },
      },
      orderBy: { date: 'desc' },
    });
    res.json(communications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.post('/contacts/:id/desires', async (req, res) => {
  try {
    const data = CreateDesireSchema.parse({ ...req.body, contactId: req.params.id });
    const desire = await prisma.desire.create({ data });
    res.status(201).json(desire);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.post('/contacts/:id/relationship-intel', async (req, res) => {
  try {
    const data = CreateRelationshipIntelSchema.parse({ ...req.body, contactId: req.params.id });
    const intel = await prisma.relationshipIntel.create({ data });
    res.status(201).json(intel);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.post('/contacts/:id/engagement-strategies', async (req, res) => {
  try {
    const data = CreateEngagementStrategySchema.parse({ ...req.body, contactId: req.params.id });
    const strategy = await prisma.engagementStrategy.create({
      data,
      include: { nextSteps: true },
    });
    res.status(201).json(strategy);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.put('/engagement-strategies/:id', async (req, res) => {
  try {
    const data = UpdateEngagementStrategySchema.parse(req.body);
    const strategy = await prisma.engagementStrategy.update({
      where: { id: req.params.id },
      data,
      include: { nextSteps: true },
    });
    res.json(strategy);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.post('/next-steps', async (req, res) => {
  try {
    const data = CreateNextStepSchema.parse(req.body);
    const step = await prisma.nextStep.create({ data });
    res.status(201).json(step);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

contactRouter.put('/next-steps/:id', async (req, res) => {
  try {
    const data = UpdateNextStepSchema.parse(req.body);
    const step = await prisma.nextStep.update({
      where: { id: req.params.id },
      data,
    });
    res.json(step);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle key stakeholder status
contactRouter.put('/contacts/:id/key-stakeholder', async (req, res) => {
  try {
    const existing = await prisma.contact.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Contact not found' });

    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { isKeyStakeholder: !existing.isKeyStakeholder },
    });
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get key stakeholders for an organization (aggregated)
contactRouter.get('/organizations/:id/key-stakeholders', async (req, res) => {
  try {
    const stakeholders = await prisma.contact.findMany({
      where: {
        organizationId: req.params.id,
        isKeyStakeholder: true,
        deletedAt: null,
      },
      include: {
        department: { select: { id: true, name: true, colorCode: true } },
        desires: { orderBy: { date: 'desc' }, take: 3 },
        relationshipIntels: { orderBy: { date: 'desc' }, take: 3 },
        engagementStrategies: {
          where: { status: 'ACTIVE' },
          include: { nextSteps: { orderBy: { date: 'asc' } } },
        },
        nextSteps: {
          where: { engagementStrategyId: null },
          orderBy: { date: 'asc' },
          take: 5,
        },
        projectMembers: {
          include: {
            project: {
              select: { id: true, name: true, type: true, healthStatus: true, stage: true },
            },
          },
        },
        teamAffinities: {
          include: { teamMember: { select: { id: true, name: true, role: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json(stakeholders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { contactRouter };
