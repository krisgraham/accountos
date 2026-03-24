import { useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import { type Node, type Edge } from '@xyflow/react';

interface OrgContact {
  id: string;
  name: string;
  title: string | null;
  stakeholderRole: string | null;
  sentiment: string | null;
  isKeyStakeholder: boolean;
  reportsToId: string | null;
  department: { id: string; name: string; colorCode: string | null } | null;
  updatedAt: string;
}

export interface OrgNodeData extends Record<string, unknown> {
  contact: OrgContact;
  collapsed: boolean;
  hiddenCount: number;
}

const NODE_WIDTH = 220;
const NODE_HEIGHT = 90;

export function useOrgChartLayout(
  contacts: OrgContact[],
  collapsedNodes: Set<string>,
) {
  return useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 80 });

    // Determine which contacts are visible
    const hiddenByCollapse = new Set<string>();
    function hideDescendants(parentId: string) {
      contacts.forEach((c) => {
        if (c.reportsToId === parentId) {
          hiddenByCollapse.add(c.id);
          hideDescendants(c.id);
        }
      });
    }
    collapsedNodes.forEach((id) => hideDescendants(id));

    const visibleContacts = contacts.filter((c) => !hiddenByCollapse.has(c.id));

    // Count hidden reports for collapsed nodes
    function countDescendants(parentId: string): number {
      let count = 0;
      contacts.forEach((c) => {
        if (c.reportsToId === parentId) {
          count += 1 + countDescendants(c.id);
        }
      });
      return count;
    }

    // Add nodes
    visibleContacts.forEach((c) => {
      const isCollapsed = collapsedNodes.has(c.id);
      const hiddenCount = isCollapsed ? countDescendants(c.id) : 0;

      g.setNode(c.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    // Add edges
    visibleContacts.forEach((c) => {
      if (c.reportsToId && !hiddenByCollapse.has(c.reportsToId)) {
        const parentVisible = visibleContacts.some((vc) => vc.id === c.reportsToId);
        if (parentVisible) {
          g.setEdge(c.reportsToId, c.id);
        }
      }
    });

    dagre.layout(g);

    const nodes: Node<OrgNodeData>[] = visibleContacts.map((c) => {
      const nodePos = g.node(c.id);
      const isCollapsed = collapsedNodes.has(c.id);
      const hiddenCount = isCollapsed ? countDescendants(c.id) : 0;

      return {
        id: c.id,
        type: 'orgNode',
        position: {
          x: (nodePos?.x ?? 0) - NODE_WIDTH / 2,
          y: (nodePos?.y ?? 0) - NODE_HEIGHT / 2,
        },
        data: {
          contact: c,
          collapsed: isCollapsed,
          hiddenCount,
        },
      };
    });

    const edges: Edge[] = visibleContacts
      .filter((c) => c.reportsToId && visibleContacts.some((vc) => vc.id === c.reportsToId))
      .map((c) => ({
        id: `${c.reportsToId}-${c.id}`,
        source: c.reportsToId!,
        target: c.id,
        type: 'smoothstep',
        style: { stroke: 'var(--color-border)', strokeWidth: 1.5 },
      }));

    return { nodes, edges };
  }, [contacts, collapsedNodes]);
}
