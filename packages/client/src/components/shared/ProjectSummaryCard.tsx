import { Link } from 'react-router-dom';
import { RAGStatus } from '../../icons';

interface ProjectSummaryCardProps {
  project: {
    id: string;
    name: string;
    type: string;
    stage: string | null;
    healthStatus: string;
    contractStatus: string | null;
    estimatedValue: number | null;
    winLikelihood: number | null;
    coverageScore: number | null;
    members?: { contact: { id: string; name: string } }[];
  };
}

const STATE_LABELS: Record<string, string> = {
  Identified: 'Presales',
  Qualifying: 'Presales',
  Proposing: 'Presales',
  Negotiating: 'Presales',
  Won: 'Pre-Start',
  Delivering: 'In Flight',
  Active: 'In Flight',
  'At Risk': 'On Hold',
  'On Hold': 'On Hold',
  Expanding: 'Expanding',
  Complete: 'Complete',
  Stable: 'Complete',
};

const STATE_COLORS: Record<string, string> = {
  Presales: 'var(--color-accent)',
  'Pre-Start': 'var(--color-contract-verbal)',
  'In Flight': 'var(--color-rag-healthy)',
  'On Hold': 'var(--color-rag-monitor)',
  Expanding: 'var(--color-dept-2)',
  Complete: 'var(--color-text-muted)',
};

export function getStateLabel(stage: string | null): string {
  if (!stage) return 'Unknown';
  return STATE_LABELS[stage] || stage;
}

export function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  const stateLabel = getStateLabel(project.stage);
  const stateColor = STATE_COLORS[stateLabel] || 'var(--color-text-muted)';
  const showWinLikelihood = project.type === 'PRESALES' && project.winLikelihood != null;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors"
    >
      {/* Top row: type + state + RAG */}
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium">
          {project.type}
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
          style={{ color: stateColor, backgroundColor: `${stateColor}20` }}
        >
          {stateLabel}
        </span>
        <div className="ml-auto">
          <RAGStatus status={project.healthStatus as 'HEALTHY' | 'MONITOR' | 'AT_RISK'} />
        </div>
      </div>

      {/* Name */}
      <div className="text-sm font-medium text-[var(--color-text-primary)] truncate">
        {project.name}
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        {project.contractStatus && (
          <span className="text-[10px] text-[var(--color-text-muted)]">
            {project.contractStatus.replace(/_/g, ' ')}
          </span>
        )}
        {project.estimatedValue != null && (
          <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">
            ${(project.estimatedValue / 1000).toFixed(0)}K
          </span>
        )}
        {showWinLikelihood && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{
              color: project.winLikelihood! >= 70 ? 'var(--color-rag-healthy)' : project.winLikelihood! >= 40 ? 'var(--color-rag-monitor)' : 'var(--color-rag-at-risk)',
              backgroundColor: project.winLikelihood! >= 70 ? 'rgba(34,197,94,0.15)' : project.winLikelihood! >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
            }}
          >
            {project.winLikelihood}% likely
          </span>
        )}
      </div>

      {/* Coverage + avatar stack */}
      <div className="flex items-center gap-2 mt-1.5">
        {project.coverageScore != null && (
          <span className="text-[10px] text-[var(--color-text-muted)]">
            Coverage: {project.coverageScore}%
          </span>
        )}
        {project.members && project.members.length > 0 && (
          <div className="flex -space-x-1.5 ml-auto">
            {project.members.slice(0, 4).map((m) => (
              <div
                key={m.contact.id}
                className="w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[8px] text-white border border-[var(--color-surface-raised)]"
                title={m.contact.name}
              >
                {m.contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
            ))}
            {project.members.length > 4 && (
              <div className="w-5 h-5 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[8px] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                +{project.members.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
