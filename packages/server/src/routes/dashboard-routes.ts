import { Router } from 'express';
import { prisma } from '@accountos/prisma';

const dashboardRouter = Router();

dashboardRouter.get('/dashboard/summary', async (_req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalAccounts,
      totalContacts,
      activeProjects,
      overdueActionItems,
      allProjects,
      staleContactRows,
      lowCoverageProjectRows,
      accountRows,
    ] = await Promise.all([
      // Total active accounts
      prisma.organization.count({ where: { deletedAt: null } }),

      // Total active contacts
      prisma.contact.count({ where: { deletedAt: null } }),

      // Active projects (not deleted)
      prisma.project.count({ where: { deletedAt: null } }),

      // Overdue action items: OPEN status with dueDate in the past
      prisma.actionItem.findMany({
        where: {
          status: 'OPEN',
          dueDate: { lt: now },
        },
        include: {
          assignee: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
        orderBy: { dueDate: 'asc' },
      }),

      // All non-deleted projects for pipeline grouping
      prisma.project.findMany({
        where: { deletedAt: null },
        select: { contractStatus: true, estimatedValue: true, type: true, winLikelihood: true },
      }),

      // Stale contacts: updatedAt older than 30 days
      prisma.contact.findMany({
        where: {
          deletedAt: null,
          updatedAt: { lt: thirtyDaysAgo },
        },
        select: {
          id: true,
          name: true,
          title: true,
          updatedAt: true,
          organization: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: 'asc' },
        take: 20,
      }),

      // Low coverage projects (coverageScore < 50 or null)
      prisma.project.findMany({
        where: {
          deletedAt: null,
          OR: [
            { coverageScore: { lt: 50 } },
            { coverageScore: null },
          ],
        },
        select: {
          id: true,
          name: true,
          coverageScore: true,
          organization: { select: { id: true, name: true } },
        },
        orderBy: { name: 'asc' },
      }),

      // Accounts with counts for health matrix
      prisma.organization.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          healthStatus: true,
          healthScore: true,
          _count: { select: { contacts: true, projects: true } },
          projects: {
            where: { deletedAt: null },
            select: { estimatedValue: true, type: true, winLikelihood: true, contractStatus: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    // Compute pipeline value grouped by contractStatus (raw + weighted)
    const pipelineByStatus: Record<string, number> = {};
    let totalPipelineValue = 0;
    let weightedPipelineValue = 0;
    for (const p of allProjects) {
      const status = p.contractStatus || 'Unknown';
      const val = p.estimatedValue || 0;
      pipelineByStatus[status] = (pipelineByStatus[status] || 0) + val;
      totalPipelineValue += val;
      // Weighted: presales uses winLikelihood, contracted/invoicing uses full value
      if (p.type === 'PRESALES' && p.winLikelihood != null) {
        weightedPipelineValue += val * (p.winLikelihood / 100);
      } else if (p.contractStatus === 'CONTRACTED' || p.contractStatus === 'INVOICING') {
        weightedPipelineValue += val;
      } else {
        weightedPipelineValue += val * 0.5; // Default 50% weight for others
      }
    }

    // Compute stale contacts with daysSinceUpdate
    const staleContacts = staleContactRows.map((c) => {
      const daysSinceUpdate = Math.floor(
        (now.getTime() - new Date(c.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        id: c.id,
        name: c.name,
        title: c.title,
        organizationName: c.organization.name,
        organizationId: c.organization.id,
        daysSinceUpdate,
      };
    });

    // Compute account health matrix rows
    const accountHealthMatrix = accountRows.map((org) => {
      let rawPipeline = 0;
      let weightedPipeline = 0;
      for (const p of org.projects) {
        const val = p.estimatedValue || 0;
        rawPipeline += val;
        if (p.type === 'PRESALES' && p.winLikelihood != null) {
          weightedPipeline += val * (p.winLikelihood / 100);
        } else if (p.contractStatus === 'CONTRACTED' || p.contractStatus === 'INVOICING') {
          weightedPipeline += val;
        } else {
          weightedPipeline += val * 0.5;
        }
      }
      return {
        id: org.id,
        name: org.name,
        healthStatus: org.healthStatus,
        healthScore: org.healthScore,
        contacts: org._count.contacts,
        projects: org._count.projects,
        pipelineValue: rawPipeline,
        weightedPipelineValue: Math.round(weightedPipeline),
      };
    });

    res.json({
      totalAccounts,
      totalContacts,
      activeProjects,
      overdueActions: overdueActionItems.length,
      overdueActionItems: overdueActionItems.map((item) => ({
        id: item.id,
        description: item.description,
        dueDate: item.dueDate,
        status: item.status,
        assigneeName: item.assignee?.name || null,
        projectName: item.project?.name || null,
        projectId: item.project?.id || null,
      })),
      pipelineValue: totalPipelineValue,
      weightedPipelineValue: Math.round(weightedPipelineValue),
      pipelineByStatus,
      staleContacts,
      lowCoverageProjects: lowCoverageProjectRows,
      accountHealthMatrix,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { dashboardRouter };
