import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { OrgChartNode } from '../components/org-chart/OrgChartNode';
import { useOrgChartLayout } from '../components/org-chart/useOrgChartLayout';
import { ContactSlideOver } from '../components/org-chart/ContactSlideOver';
import { PageHeader } from '../components/PageHeader';
import { SearchIcon } from '../icons';

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

const nodeTypes: NodeTypes = {
  orgNode: OrgChartNode as NodeTypes['orgNode'],
};

export function OrgChartPage() {
  const { id: orgId } = useParams<{ id: string }>();
  const [contacts, setContacts] = useState<OrgContact[]>([]);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!orgId) return;
    Promise.all([
      fetch(`/api/organizations/${orgId}`).then((r) => r.json()),
      fetch(`/api/organizations/${orgId}/contacts`).then((r) => r.json()),
    ])
      .then(([org, contactList]) => {
        setOrgName(org.name || '');
        setContacts(contactList || []);
      })
      .catch(() => {
        setContacts([]);
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  const { nodes: layoutNodes, edges: layoutEdges } = useOrgChartLayout(contacts, collapsedNodes);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  const hasChildren = useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c) => {
      if (c.reportsToId) set.add(c.reportsToId);
    });
    return set;
  }, [contacts]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      // If node has children, toggle collapse. Otherwise open slide-over.
      if (hasChildren.has(node.id)) {
        setCollapsedNodes((prev) => {
          const next = new Set(prev);
          if (next.has(node.id)) {
            next.delete(node.id);
          } else {
            next.add(node.id);
          }
          return next;
        });
      }
      setSelectedContactId(node.id);
    },
    [hasChildren],
  );

  const departments = useMemo(() => {
    const map = new Map<string, { name: string; colorCode: string }>();
    contacts.forEach((c) => {
      if (c.department?.colorCode) {
        map.set(c.department.id, {
          name: c.department.name,
          colorCode: c.department.colorCode,
        });
      }
    });
    return Array.from(map.values());
  }, [contacts]);

  if (loading) {
    return <div className="p-6 text-[var(--color-text-muted)]">Loading org chart...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={`${orgName} Org Chart`} subtitle={`${contacts.length} contacts`} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
          <SearchIcon size={14} className="text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Find contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none w-32"
          />
        </div>
        {/* Department legend */}
        <div className="flex items-center gap-2 ml-auto">
          {departments.map((d) => (
            <div key={d.name} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.colorCode }} />
              <span className="text-[11px] text-[var(--color-text-muted)]">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1" data-testid="org-chart-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="var(--color-border)" gap={20} size={1} />
          <Controls
            showInteractive={false}
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              borderColor: 'var(--color-border)',
            }}
          />
          <MiniMap
            nodeColor={(node) => {
              const dept = (node.data as { contact: OrgContact }).contact?.department;
              return dept?.colorCode || 'var(--color-accent)';
            }}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          />
        </ReactFlow>
      </div>

      {/* Slide-over */}
      <ContactSlideOver
        contactId={selectedContactId}
        onClose={() => setSelectedContactId(null)}
      />
    </div>
  );
}
