type HealthStatus = 'HEALTHY' | 'MONITOR' | 'AT_RISK';

interface RAGStatusProps {
  status: HealthStatus;
  className?: string;
}

const STATUS_CONFIG: Record<HealthStatus, { color: string; label: string }> = {
  HEALTHY: { color: '#22c55e', label: 'Healthy' },
  MONITOR: { color: '#f59e0b', label: 'Monitor' },
  AT_RISK: { color: '#ef4444', label: 'At Risk' },
};

function HealthyShape({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill={color}
      stroke="none"
    >
      <circle cx="7" cy="7" r="6" />
    </svg>
  );
}

function MonitorShape({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill={color}
      stroke="none"
    >
      <rect x="2" y="2" width="10" height="10" rx="1" transform="rotate(45 7 7)" />
    </svg>
  );
}

function AtRiskShape({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill={color}
      stroke="none"
    >
      <polygon points="7 1 13 13 1 13" />
    </svg>
  );
}

const SHAPE_MAP: Record<HealthStatus, (props: { color: string }) => JSX.Element> = {
  HEALTHY: HealthyShape,
  MONITOR: MonitorShape,
  AT_RISK: AtRiskShape,
};

export function RAGStatus({ status, className = '' }: RAGStatusProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const Shape = SHAPE_MAP[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}
      style={{ color: config.color }}
    >
      <Shape color={config.color} />
      {config.label}
    </span>
  );
}
