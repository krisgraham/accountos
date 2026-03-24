import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { OrgNodeData } from './useOrgChartLayout';
import { SentimentDot, RoleBadge, KeyStakeholderBadgeIcon } from '../../icons';

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function lastContactColor(days: number): string {
  if (days <= 7) return 'var(--color-rag-healthy)';
  if (days <= 30) return 'var(--color-rag-monitor)';
  return 'var(--color-rag-at-risk)';
}

function lastContactLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export const OrgChartNode = memo(function OrgChartNode({
  data,
}: NodeProps & { data: OrgNodeData }) {
  const { contact, collapsed, hiddenCount } = data;
  const days = daysSince(contact.updatedAt);
  const deptColor = contact.department?.colorCode || 'var(--color-accent)';
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <div
        className="relative bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-lg overflow-hidden cursor-pointer hover:border-[var(--color-accent)] transition-colors"
        style={{ width: 220, minHeight: 80 }}
      >
        {/* Department color accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: deptColor }}
        />

        {/* Key stakeholder badge */}
        {contact.isKeyStakeholder && (
          <div className="absolute top-1 right-1">
            <KeyStakeholderBadgeIcon size={12} className="text-amber-400" />
          </div>
        )}

        <div className="pl-3 pr-2 py-2">
          {/* Top: avatar + name + title */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0"
              style={{ backgroundColor: deptColor }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-[var(--color-text-primary)] truncate leading-tight">
                {contact.name}
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)] truncate leading-tight">
                {contact.title || 'No title'}
              </div>
            </div>
          </div>

          {/* Bottom strip: role badge + sentiment + last contact */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {contact.stakeholderRole && (
              <RoleBadge role={contact.stakeholderRole as Parameters<typeof RoleBadge>[0]['role']} />
            )}
            {contact.sentiment && (
              <SentimentDot sentiment={contact.sentiment as Parameters<typeof SentimentDot>[0]['sentiment']} />
            )}
            <span
              className="ml-auto text-[10px] font-medium"
              style={{ color: lastContactColor(days) }}
            >
              {lastContactLabel(days)}
            </span>
          </div>
        </div>

        {/* Collapse badge */}
        {collapsed && hiddenCount > 0 && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-medium">
            +{hiddenCount}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </>
  );
});
