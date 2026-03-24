import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CheckIcon } from '../../icons';

interface NextStepItem {
  id: string;
  type: string;
  date: string | null;
  notes: string | null;
  status: string;
}

interface Strategy {
  id: string;
  title: string;
  narrative: string | null;
  status: string;
  nextSteps: NextStepItem[];
}

interface EngagementStrategyCardProps {
  strategy: Strategy;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'var(--color-rag-healthy)',
  COMPLETED: 'var(--color-text-muted)',
  SUPERSEDED: 'var(--color-rag-monitor)',
};

export function EngagementStrategyCard({ strategy }: EngagementStrategyCardProps) {
  const [expanded, setExpanded] = useState(strategy.status === 'ACTIVE');

  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-hover)] transition-colors text-left"
      >
        {expanded ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
        <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)] truncate">
          {strategy.title}
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
          style={{
            color: STATUS_COLORS[strategy.status] || 'var(--color-text-muted)',
            backgroundColor: `${STATUS_COLORS[strategy.status] || 'var(--color-text-muted)'}20`,
          }}
        >
          {strategy.status}
        </span>
      </button>

      {expanded && (
        <div className="px-3 py-2 space-y-2">
          {strategy.narrative && (
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed italic">
              {strategy.narrative}
            </p>
          )}

          {strategy.nextSteps.length > 0 && (
            <div className="space-y-1">
              {strategy.nextSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-start gap-2 px-2 py-1.5 rounded text-xs ${
                    step.status === 'COMPLETED' ? 'opacity-50' : ''
                  }`}
                >
                  <CheckIcon
                    size={12}
                    className={`mt-0.5 shrink-0 ${
                      step.status === 'COMPLETED' ? 'text-[var(--color-rag-healthy)]' : 'text-[var(--color-text-muted)]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={step.status === 'COMPLETED' ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]'}>
                      {step.notes || step.type}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[var(--color-accent)]">{step.type}</span>
                      {step.date && (
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {new Date(step.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {strategy.nextSteps.length === 0 && (
            <div className="text-xs text-[var(--color-text-muted)] text-center py-2">
              No steps defined yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
