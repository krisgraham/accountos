import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RAGStatus, RoleBadge, SentimentDot, CheckIcon, PlusIcon } from '../icons';
import { CoverageMatrix } from '../components/shared/CoverageMatrix';
import { getStateLabel } from '../components/shared/ProjectSummaryCard';

interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  type: string;
  stage: string | null;
  healthStatus: string;
  contractStatus: string | null;
  estimatedValue: number | null;
  winLikelihood: number | null;
  coverageScore: number | null;
  organization: { id: string; name: string };
  department: { id: string; name: string } | null;
  members: {
    id: string;
    role: string;
    engagementRoles: string | null;
    contact: { id: string; name: string; title: string | null; stakeholderRole: string | null; sentiment: string | null };
  }[];
  meetingNotes: { id: string; date: string; summary: string | null }[];
  actionItems: {
    id: string;
    description: string;
    dueDate: string | null;
    status: string;
    assignee: { id: string; name: string } | null;
  }[];
  nextSteps: { id: string; type: string; date: string | null; notes: string | null; status: string }[];
}

const CONTRACT_COLORS: Record<string, string> = {
  PROPOSED: 'var(--color-contract-proposed)',
  VERBAL_COMMIT: 'var(--color-contract-verbal)',
  CONTRACTED: 'var(--color-contract-contracted)',
  INVOICING: 'var(--color-contract-invoicing)',
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        // Parse engagement roles from JSON strings
        if (data.members) {
          data.members = data.members.map((m: { engagementRoles: string | null }) => ({
            ...m,
            engagementRoles: m.engagementRoles ? (typeof m.engagementRoles === 'string' ? JSON.parse(m.engagementRoles) : m.engagementRoles) : [],
          }));
        }
        setProject(data);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  const completeAction = async (actionId: string) => {
    await fetch(`/api/action-items/${actionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DONE' }),
    });
    if (project) {
      setProject({
        ...project,
        actionItems: project.actionItems.map((a) =>
          a.id === actionId ? { ...a, status: 'DONE' } : a,
        ),
      });
    }
  };

  if (loading) return <div className="p-6 text-[var(--color-text-muted)]">Loading...</div>;
  if (!project) return <div className="p-6 text-[var(--color-text-muted)]">Project not found</div>;

  const stateLabel = getStateLabel(project.stage);
  const showWinLikelihood = project.type === 'PRESALES' && project.winLikelihood != null;

  return (
    <div>
      <PageHeader
        title={project.name}
        subtitle={
          <span className="flex items-center gap-2">
            <Link to={`/accounts/${project.organization.id}`} className="hover:text-[var(--color-accent)]">
              {project.organization.name}
            </Link>
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">{project.type}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)]">{stateLabel}</span>
            {project.contractStatus && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                color: CONTRACT_COLORS[project.contractStatus] || 'var(--color-text-muted)',
                backgroundColor: `${CONTRACT_COLORS[project.contractStatus] || 'var(--color-text-muted)'}20`,
              }}>
                {project.contractStatus.replace(/_/g, ' ')}
              </span>
            )}
            {showWinLikelihood && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                color: project.winLikelihood! >= 70 ? 'var(--color-rag-healthy)' : project.winLikelihood! >= 40 ? 'var(--color-rag-monitor)' : 'var(--color-rag-at-risk)',
                backgroundColor: project.winLikelihood! >= 70 ? 'rgba(34,197,94,0.15)' : project.winLikelihood! >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
              }}>
                {project.winLikelihood}% likely
              </span>
            )}
            <RAGStatus status={project.healthStatus as 'HEALTHY' | 'MONITOR' | 'AT_RISK'} />
          </div>
        }
      />

      <div className="p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <div className="text-sm text-[var(--color-text-muted)]">Estimated Value</div>
            <div className="text-2xl font-semibold text-[var(--color-text-primary)] mt-1">
              {project.estimatedValue != null ? `$${(project.estimatedValue / 1000).toFixed(0)}K` : '--'}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <div className="text-sm text-[var(--color-text-muted)]">Stage</div>
            <div className="text-xl font-semibold text-[var(--color-text-primary)] mt-1">{project.stage || 'Not set'}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{stateLabel}</div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <div className="text-sm text-[var(--color-text-muted)]">Team Members</div>
            <div className="text-2xl font-semibold text-[var(--color-text-primary)] mt-1">{project.members.length}</div>
          </div>
          {showWinLikelihood && (
            <div className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
              <div className="text-sm text-[var(--color-text-muted)]">Win Likelihood</div>
              <div className="text-2xl font-semibold text-[var(--color-text-primary)] mt-1">{project.winLikelihood}%</div>
              <div className="mt-1 w-full h-1.5 rounded-full bg-[var(--color-surface)]">
                <div className="h-full rounded-full" style={{
                  width: `${project.winLikelihood}%`,
                  backgroundColor: project.winLikelihood! >= 70 ? 'var(--color-rag-healthy)' : project.winLikelihood! >= 40 ? 'var(--color-rag-monitor)' : 'var(--color-rag-at-risk)',
                }} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {project.description && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Description</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{project.description}</p>
              </div>
            )}

            {/* Action Items */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                Action Items ({project.actionItems.filter((a) => a.status !== 'DONE').length} open)
              </h3>
              <div className="space-y-1">
                {project.actionItems.map((item) => {
                  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'DONE';
                  return (
                    <div key={item.id} className={`flex items-center gap-2 p-2 rounded-md ${item.status === 'DONE' ? 'opacity-50' : ''} ${isOverdue ? 'bg-red-950/20' : 'bg-[var(--color-surface-raised)]'} border border-[var(--color-border)]`}>
                      <button onClick={() => completeAction(item.id)} disabled={item.status === 'DONE'} className={`p-0.5 rounded ${item.status === 'DONE' ? 'text-[var(--color-rag-healthy)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-rag-healthy)]'}`}>
                        <CheckIcon size={14} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${item.status === 'DONE' ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]'}`}>{item.description}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{item.assignee?.name}{item.dueDate && ` - Due ${new Date(item.dueDate).toLocaleDateString()}`}</div>
                      </div>
                      {isOverdue && <span className="text-xs text-[var(--color-rag-at-risk)] shrink-0">Overdue</span>}
                    </div>
                  );
                })}
                {project.actionItems.length === 0 && <div className="text-sm text-[var(--color-text-muted)] text-center py-4">No action items</div>}
              </div>
            </div>

            {/* Meeting Notes */}
            {project.meetingNotes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Recent Meeting Notes</h3>
                <div className="space-y-2">
                  {project.meetingNotes.map((note) => (
                    <Link key={note.id} to={`/meeting-notes/${note.id}`} className="block p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors">
                      <div className="text-xs text-[var(--color-text-muted)]">{new Date(note.date).toLocaleDateString()}</div>
                      {note.summary && <div className="text-sm text-[var(--color-text-primary)] mt-0.5">{note.summary}</div>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column (2/5) - Coverage Matrix + Tagged Contacts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coverage Matrix */}
            <CoverageMatrix projectType={project.type} members={project.members} />

            {/* Tagged Contacts */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Tagged Contacts</h3>
              <div className="space-y-1">
                {project.members.map((m) => (
                  <Link key={m.id} to={`/contacts/${m.contact.id}`} className="flex items-center gap-2 p-2 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--color-text-primary)] truncate">{m.contact.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)] truncate">{m.role}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {m.contact.stakeholderRole && <RoleBadge role={m.contact.stakeholderRole as Parameters<typeof RoleBadge>[0]['role']} />}
                      {m.contact.sentiment && <SentimentDot sentiment={m.contact.sentiment as Parameters<typeof SentimentDot>[0]['sentiment']} />}
                    </div>
                  </Link>
                ))}
                {project.members.length === 0 && <div className="text-sm text-[var(--color-text-muted)] text-center py-4">No contacts tagged</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
