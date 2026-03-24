import { CheckIcon, CloseIcon } from '../../icons';

interface RoleDef {
  key: string;
  label: string;
  critical?: boolean;
}

const ENGAGEMENT_ROLES: Record<string, { label: string; roles: RoleDef[] }> = {
  authority: {
    label: 'Authority',
    roles: [
      { key: 'TECH_APPROVER', label: 'Tech Approver' },
      { key: 'BUSINESS_APPROVER', label: 'Business Approver' },
      { key: 'BUDGET_AUTHORITY', label: 'Budget Authority', critical: true },
      { key: 'FINAL_APPROVER', label: 'Final Approver' },
    ],
  },
  knowledge: {
    label: 'Knowledge',
    roles: [
      { key: 'BUSINESS_DOMAIN_EXPERT', label: 'Business Domain Expert' },
      { key: 'DATA_DOMAIN_EXPERT', label: 'Data Domain Expert', critical: true },
      { key: 'TECH_DOMAIN_EXPERT', label: 'Tech Domain Expert' },
      { key: 'PROCESS_OWNER', label: 'Process Owner' },
    ],
  },
  engagement: {
    label: 'Engagement',
    roles: [
      { key: 'DAY_TO_DAY_CONTACT', label: 'Day-to-Day Contact' },
      { key: 'CHAMPION', label: 'Champion' },
      { key: 'BLOCKER', label: 'Blocker' },
    ],
  },
};

const APPLICABLE_ROLES: Record<string, string[]> = {
  PRESALES: [
    'TECH_APPROVER', 'BUSINESS_APPROVER', 'BUDGET_AUTHORITY', 'FINAL_APPROVER',
    'BUSINESS_DOMAIN_EXPERT', 'DATA_DOMAIN_EXPERT', 'TECH_DOMAIN_EXPERT', 'PROCESS_OWNER',
    'CHAMPION',
  ],
  ACTIVE: [
    'TECH_APPROVER', 'BUSINESS_APPROVER', 'BUDGET_AUTHORITY', 'FINAL_APPROVER',
    'BUSINESS_DOMAIN_EXPERT', 'DATA_DOMAIN_EXPERT', 'TECH_DOMAIN_EXPERT', 'PROCESS_OWNER',
    'DAY_TO_DAY_CONTACT', 'CHAMPION', 'BLOCKER',
  ],
  ONGOING: [
    'TECH_APPROVER', 'BUSINESS_APPROVER', 'BUDGET_AUTHORITY', 'FINAL_APPROVER',
    'DAY_TO_DAY_CONTACT', 'CHAMPION',
  ],
  STRATEGIC: [
    'TECH_APPROVER', 'BUSINESS_APPROVER', 'BUDGET_AUTHORITY', 'FINAL_APPROVER',
    'DAY_TO_DAY_CONTACT', 'CHAMPION',
  ],
};

interface Member {
  id: string;
  role: string;
  engagementRoles: string[] | string | null;
  contact: { id: string; name: string; title?: string | null };
}

interface CoverageMatrixProps {
  projectType: string;
  members: Member[];
}

function parseEngagementRoles(roles: string[] | string | null): string[] {
  if (!roles) return [];
  if (Array.isArray(roles)) return roles;
  try { return JSON.parse(roles); } catch { return []; }
}

export function CoverageMatrix({ projectType, members }: CoverageMatrixProps) {
  const applicable = APPLICABLE_ROLES[projectType] || APPLICABLE_ROLES.ACTIVE;

  // Build a map of role -> assigned person(s)
  const roleAssignments = new Map<string, string[]>();
  members.forEach((m) => {
    const roles = parseEngagementRoles(m.engagementRoles);
    roles.forEach((role) => {
      const existing = roleAssignments.get(role) || [];
      existing.push(m.contact.name);
      roleAssignments.set(role, existing);
    });
  });

  const filledCount = applicable.filter((r) => roleAssignments.has(r)).length;
  const totalApplicable = applicable.length;
  const score = totalApplicable > 0 ? Math.round((filledCount / totalApplicable) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Engagement Coverage: {filledCount} of {totalApplicable} roles
        </h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            color: score >= 70 ? 'var(--color-rag-healthy)' : score >= 40 ? 'var(--color-rag-monitor)' : 'var(--color-rag-at-risk)',
            backgroundColor: score >= 70 ? 'rgba(34,197,94,0.15)' : score >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
          }}
        >
          {score}%
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(ENGAGEMENT_ROLES).map(([groupKey, group]) => {
          const applicableInGroup = group.roles.filter((r) => applicable.includes(r.key));
          if (applicableInGroup.length === 0) return null;

          return (
            <div key={groupKey}>
              <div className="text-xs font-medium text-[var(--color-text-muted)] uppercase mb-1.5">
                {group.label}
              </div>
              <div className="space-y-1">
                {applicableInGroup.map((role) => {
                  const assignees = roleAssignments.get(role.key);
                  const filled = !!assignees && assignees.length > 0;
                  const isCriticalMissing = !filled && role.critical;

                  return (
                    <div
                      key={role.key}
                      className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                        filled
                          ? 'bg-[var(--color-surface-raised)]'
                          : isCriticalMissing
                            ? 'bg-red-950/20 border border-red-900/30'
                            : 'bg-[var(--color-surface-raised)] border border-dashed border-[var(--color-border)]'
                      }`}
                    >
                      {filled ? (
                        <CheckIcon size={12} className="text-[var(--color-rag-healthy)] shrink-0" />
                      ) : (
                        <CloseIcon size={12} className={`shrink-0 ${isCriticalMissing ? 'text-[var(--color-rag-at-risk)]' : 'text-[var(--color-text-muted)]'}`} />
                      )}
                      <span className={filled ? 'text-[var(--color-text-primary)]' : isCriticalMissing ? 'text-[var(--color-rag-at-risk)]' : 'text-[var(--color-text-muted)]'}>
                        {role.label}:
                      </span>
                      <span className={`ml-auto ${filled ? 'text-[var(--color-text-secondary)]' : isCriticalMissing ? 'text-[var(--color-rag-at-risk)] font-medium' : 'text-[var(--color-text-muted)]'}`}>
                        {filled ? assignees!.join(', ') : 'NOT IDENTIFIED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function getCoverageScore(projectType: string, members: Member[]): { filled: number; total: number; score: number } {
  const applicable = APPLICABLE_ROLES[projectType] || APPLICABLE_ROLES.ACTIVE;
  const roleAssignments = new Set<string>();
  members.forEach((m) => {
    const roles = parseEngagementRoles(m.engagementRoles);
    roles.forEach((role) => roleAssignments.add(role));
  });
  const filled = applicable.filter((r) => roleAssignments.has(r)).length;
  return { filled, total: applicable.length, score: applicable.length > 0 ? Math.round((filled / applicable.length) * 100) : 0 };
}
