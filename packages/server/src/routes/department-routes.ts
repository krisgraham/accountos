import { Router } from 'express';
import { prisma } from '@accountos/prisma';
import {
  CreateDepartmentSchema,
  UpdateDepartmentSchema,
  DepartmentListQuerySchema,
} from '@accountos/shared';
import { ZodError } from 'zod';

const departmentRouter = Router();

departmentRouter.get('/departments', async (req, res) => {
  try {
    const { page, limit, search, organizationId } = DepartmentListQuerySchema.parse(req.query);
    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.name = { contains: search };
    if (organizationId) where.organizationId = organizationId;

    const [data, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          organization: { select: { id: true, name: true } },
          _count: { select: { contacts: true } },
        },
      }),
      prisma.department.count({ where }),
    ]);

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

departmentRouter.get('/departments/:id', async (req, res) => {
  try {
    const dept = await prisma.department.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: {
        organization: { select: { id: true, name: true } },
        contacts: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
          select: { id: true, name: true, title: true, stakeholderRole: true, sentiment: true },
        },
        _count: { select: { contacts: true, projects: true } },
      },
    });
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    res.json(dept);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

departmentRouter.post('/departments', async (req, res) => {
  try {
    const data = CreateDepartmentSchema.parse(req.body);
    const dept = await prisma.department.create({ data });
    res.status(201).json(dept);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

departmentRouter.put('/departments/:id', async (req, res) => {
  try {
    const data = UpdateDepartmentSchema.parse(req.body);
    const existing = await prisma.department.findFirst({
      where: { id: req.params.id, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Department not found' });

    const dept = await prisma.department.update({
      where: { id: req.params.id },
      data,
    });
    res.json(dept);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { departmentRouter };
