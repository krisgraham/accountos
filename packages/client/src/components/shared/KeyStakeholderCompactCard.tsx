import { Link } from 'react-router-dom';
import { SentimentDot } from '../../icons';
import { EngagementStatusBadge } from './EngagementStatusBadge';

interface KeyStakeholder {
  id: string;
  name: string;
  title: string | null;
  sentiment: string | null;
  engagementStatus: string | null;
  updatedAt: string;
  department: { id: string; name: string; colorCode: string | null } | null;
  projectMembers?: { project: { id: string; name: string; healthStatus: string } }[];
  teamAffinities?: { teamMember: { id: string; name: string; role: string | null } }[];
}

interface KeyStakeholderCompactCardProps {
  stakeholder: KeyStakeholder;
}

export function KeyStakeholderCompactCard({ stakeholder }: KeyStakeholderCompactCardProps) {
  const days = Math.floor((Date.now() - new Date(stakeholder.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
  const deptColor = stakeholder.department?.colorCode || 'var(--color-accent)';
  const initials = stakeholder.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const assignedTeam = stakeholder.teamAffinities?.[0]?.teamMember;

  return (
    <Link
      to={`/contacts/${stakeholder.id}`}
      className="flex flex-col p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors min-w-[200px] max-w-[240px]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0"
          style={{ backgroundColor: deptColor }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-[var(--color-text-primary)] truncate">{stakeholder.name}</div>
          <div className="text-[10px] text-[var(--color-text-muted)] truncate">{stakeholder.title}</div>
        </div>
      </div>

      {/* Sentiment + Engagement */}
      <div className="flex items-center gap-1.5 mb-1.5">
        {stakeholder.sentiment && (
          <SentimentDot sentiment={stakeholder.sentiment as Parameters<typeof SentimentDot>[0]['sentiment']} />
        )}
        {stakeholder.engagementStatus && (
          <EngagementStatusBadge status={stakeholder.engagementStatus} />
        )}
      </div>

      {/* Last contact */}
      <div className="text-[10px] text-[var(--color-text-muted)]">
        Last contact: <span style={{ color: days <= 7 ? 'var(--color-rag-healthy)' : days <= 30 ? 'var(--color-rag-monitor)' : 'var(--color-rag-at-risk)' }}>
          {days === 0 ? 'Today' : `${days}d ago`}
        </span>
      </div>

      {/* Assigned team member */}
      {assignedTeam && (
        <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
          Team: {assignedTeam.name}
        </div>
      )}

      {/* Project RAG summary */}
      {stakeholder.projectMembers && stakeholder.projectMembers.length > 0 && (
        <div className="flex gap-1 mt-1.5">
          {stakeholder.projectMembers.slice(0, 3).map((pm) => (
            <span
              key={pm.project.id}
              className="w-2 h-2 rounded-full"
              title={`${pm.project.name}: ${pm.project.healthStatus}`}
              style={{
                backgroundColor:
                  pm.project.healthStatus === 'HEALTHY' ? 'var(--color-rag-healthy)'
                    : pm.project.healthStatus === 'MONITOR' ? 'var(--color-rag-monitor)'
                      : 'var(--color-rag-at-risk)',
              }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
