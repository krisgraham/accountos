const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NOT_YET_ENGAGED: { label: 'Not Yet Engaged', color: '#94a3b8' },
  OUTREACH_INITIATED: { label: 'Outreach Initiated', color: '#f59e0b' },
  INITIAL_CONTACT: { label: 'Initial Contact', color: '#3b82f6' },
  RELATIONSHIP_BUILDING: { label: 'Building', color: '#8b5cf6' },
  ACTIVE_RELATIONSHIP: { label: 'Active', color: '#22c55e' },
  DORMANT: { label: 'Dormant', color: '#ef4444' },
  RE_ENGAGING: { label: 'Re-engaging', color: '#f97316' },
};

interface EngagementStatusBadgeProps {
  status: string;
  className?: string;
}

export function EngagementStatusBadge({ status, className = '' }: EngagementStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        color: config.color,
        backgroundColor: `${config.color}20`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
