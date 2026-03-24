import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RAGStatus, CheckIcon, AlertTriangleIcon, ClockIcon, SortIcon } from '../icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OverdueActionItem {
  id: string;
  description: string;
  dueDate: string | null;
  status: string;
  assigneeName: string | null;
  projectName: string | null;
  projectId: string | null;
}

interface StaleContact {
  id: string;
  name: string;
  title: string | null;
  organizationName: string;
  organizationId: string;
  daysSinceUpdate: number;
}

interface AccountHealthRow {
  id: string;
  name: string;
  healthStatus: string;
  healthScore: number | null;
  contacts: number;
  projects: number;
  pipelineValue: number;
  weightedPipelineValue: number;
}

interface DashboardSummary {
  totalAccounts: number;
  totalContacts: number;
  activeProjects: number;
  overdueActions: number;
  overdueActionItems: OverdueActionItem[];
  pipelineValue: number;
  weightedPipelineValue: number;
  pipelineByStatus: Record<string, number>;
  staleContacts: StaleContact[];
  lowCoverageProjects: {
    id: string;
    name: string;
    coverageScore: number | null;
    organization: { id: string; name: string };
  }[];
  accountHealthMatrix: AccountHealthRow[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysOverdue(dateStr: string | null): number {
  if (!dateStr) return 0;
  const now = new Date();
  const due = new Date(dateStr);
  return Math.max(0, Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
}

type SortField = 'name' | 'healthStatus' | 'contacts' | 'projects' | 'pipelineValue';
type SortDir = 'asc' | 'desc';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [pipelineHover, setPipelineHover] = useState(false);

  // Account health matrix sorting
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch('/api/dashboard/summary')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load dashboard');
        return r.json();
      })
      .then((summary: DashboardSummary) => {
        setData(summary);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Complete an action item
  const handleComplete = async (id: string) => {
    setCompletingId(id);
    try {
      const res = await fetch(`/api/action-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DONE' }),
      });
      if (res.ok) {
        // Refresh dashboard data
        fetchData();
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setCompletingId(null);
    }
  };

  // Sort the account health matrix
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir(field === 'name' ? 'asc' : 'desc');
    }
  };

  const sortedAccounts = [...(data?.accountHealthMatrix || [])].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'name':
        return dir * a.name.localeCompare(b.name);
      case 'healthStatus': {
        const order: Record<string, number> = { AT_RISK: 0, MONITOR: 1, HEALTHY: 2 };
        return dir * ((order[a.healthStatus] ?? 3) - (order[b.healthStatus] ?? 3));
      }
      case 'contacts':
        return dir * (a.contacts - b.contacts);
      case 'projects':
        return dir * (a.projects - b.projects);
      case 'pipelineValue':
        return dir * (a.pipelineValue - b.pipelineValue);
      default:
        return 0;
    }
  });

  // ---------------------------------------------------------------------------
  // KPI cards configuration
  // ---------------------------------------------------------------------------

  const kpis = [
    {
      label: 'Total Accounts',
      value: data?.totalAccounts ?? '--',
      alert: false,
    },
    {
      label: 'Contacts Managed',
      value: data?.totalContacts ?? '--',
      alert: false,
    },
    {
      label: 'Active Projects',
      value: data?.activeProjects ?? '--',
      alert: false,
    },
    {
      label: 'Pipeline (Raw / Weighted)',
      value: data ? `${formatCurrency(data.pipelineValue)} / ${formatCurrency(data.weightedPipelineValue)}` : '--',
      alert: false,
      hasPipelineBreakdown: true,
    },
    {
      label: 'Overdue Actions',
      value: data?.overdueActions ?? 0,
      alert: (data?.overdueActions ?? 0) > 0,
    },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (error && !data) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Account intelligence overview" />
        <div className="p-6">
          <div className="text-sm text-[var(--color-rag-at-risk)]">
            Failed to load dashboard data. Please try refreshing.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Account intelligence overview" />

      <div className="p-6 space-y-6">
        {/* ----------------------------------------------------------------- */}
        {/* Top Row: KPI Cards                                                */}
        {/* ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map(({ label, value, alert, hasPipelineBreakdown }) => (
            <div
              key={label}
              className={`relative p-4 rounded-lg bg-[var(--color-surface-raised)] border ${
                alert
                  ? 'border-[var(--color-rag-at-risk)]'
                  : 'border-[var(--color-border)]'
              }`}
              {...(hasPipelineBreakdown
                ? {
                    onMouseEnter: () => setPipelineHover(true),
                    onMouseLeave: () => setPipelineHover(false),
                  }
                : {})}
            >
              <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
              <div
                className={`text-2xl font-semibold mt-1 ${
                  alert
                    ? 'text-[var(--color-rag-at-risk)]'
                    : 'text-[var(--color-text-primary)]'
                }`}
              >
                {loading ? '--' : value}
              </div>
              {alert && !loading && (
                <div className="absolute top-3 right-3">
                  <AlertTriangleIcon size={16} />
                </div>
              )}

              {/* Pipeline breakdown tooltip */}
              {hasPipelineBreakdown && pipelineHover && data && (
                <div className="absolute z-10 top-full left-0 mt-1 w-56 p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] shadow-lg">
                  <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                    Pipeline by Contract Status
                  </div>
                  {Object.entries(data.pipelineByStatus).length === 0 ? (
                    <div className="text-xs text-[var(--color-text-muted)]">No data</div>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(data.pipelineByStatus).map(([status, val]) => (
                        <div key={status} className="flex items-center justify-between text-xs">
                          <span className="text-[var(--color-text-secondary)]">
                            {status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[var(--color-text-primary)] font-medium">
                            {formatCurrency(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Second Row: Action Items + Engagement Alerts                      */}
        {/* ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Items (overdue) */}
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <ClockIcon size={16} />
              Action Items
              {data && data.overdueActions > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-rag-at-risk)]/10 text-[var(--color-rag-at-risk)]">
                  {data.overdueActions} overdue
                </span>
              )}
            </h2>
            <div className="space-y-2">
              {loading ? (
                <div className="text-sm text-[var(--color-text-muted)] py-4 text-center">
                  Loading...
                </div>
              ) : (data?.overdueActionItems || []).length === 0 ? (
                <div className="text-sm text-[var(--color-text-muted)] text-center py-6 bg-[var(--color-surface-raised)] rounded-lg border border-[var(--color-border)]">
                  No overdue action items
                </div>
              ) : (
                (data?.overdueActionItems || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--color-text-primary)]">
                        {item.description}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        {item.assigneeName && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            Assignee: {item.assigneeName}
                          </span>
                        )}
                        {item.dueDate && (
                          <span
                            className={`text-xs ${
                              daysOverdue(item.dueDate) > 0
                                ? 'text-[var(--color-rag-at-risk)]'
                                : 'text-[var(--color-text-muted)]'
                            }`}
                          >
                            Due: {formatDate(item.dueDate)}
                            {daysOverdue(item.dueDate) > 0 &&
                              ` (${daysOverdue(item.dueDate)}d overdue)`}
                          </span>
                        )}
                        {item.projectName && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            Project: {item.projectName}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleComplete(item.id)}
                      disabled={completingId === item.id}
                      className="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-colors disabled:opacity-50"
                      title="Mark as complete"
                    >
                      <CheckIcon size={14} />
                      {completingId === item.id ? 'Saving...' : 'Complete'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Engagement Alerts */}
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <AlertTriangleIcon size={16} />
              Engagement Alerts
              {data && data.staleContacts.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-rag-at-risk)]/10 text-[var(--color-rag-at-risk)]">
                  {data.staleContacts.length} stale
                </span>
              )}
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="text-sm text-[var(--color-text-muted)] py-4 text-center">
                  Loading...
                </div>
              ) : (data?.staleContacts || []).length === 0 ? (
                <div className="text-sm text-[var(--color-text-muted)] text-center py-6 bg-[var(--color-surface-raised)] rounded-lg border border-[var(--color-border)]">
                  All contacts recently engaged
                </div>
              ) : (
                (data?.staleContacts || []).map((contact) => (
                  <Link
                    key={contact.id}
                    to={`/contacts/${contact.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--color-text-primary)]">
                        {contact.name}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {contact.title && <span>{contact.title} at </span>}
                        {contact.organizationName}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className={`text-xs font-medium ${
                          contact.daysSinceUpdate > 60
                            ? 'text-[var(--color-rag-at-risk)]'
                            : 'text-[var(--color-text-muted)]'
                        }`}
                      >
                        {contact.daysSinceUpdate}d ago
                      </div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">last updated</div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Third Row: Account Health Matrix                                  */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Account Health Matrix
          </h2>
          <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-surface-raised)]">
                  <SortableHeader
                    label="Account"
                    field="name"
                    currentField={sortField}
                    currentDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Health"
                    field="healthStatus"
                    currentField={sortField}
                    currentDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Contacts"
                    field="contacts"
                    currentField={sortField}
                    currentDir={sortDir}
                    onSort={handleSort}
                    align="right"
                  />
                  <SortableHeader
                    label="Projects"
                    field="projects"
                    currentField={sortField}
                    currentDir={sortDir}
                    onSort={handleSort}
                    align="right"
                  />
                  <SortableHeader
                    label="Pipeline Value"
                    field="pipelineValue"
                    currentField={sortField}
                    currentDir={sortDir}
                    onSort={handleSort}
                    align="right"
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                      Loading...
                    </td>
                  </tr>
                ) : sortedAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                      No accounts yet
                    </td>
                  </tr>
                ) : (
                  sortedAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/accounts/${account.id}`}
                          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                        >
                          {account.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <RAGStatus
                          status={account.healthStatus as 'HEALTHY' | 'MONITOR' | 'AT_RISK'}
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--color-text-secondary)]">
                        {account.contacts}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--color-text-secondary)]">
                        {account.projects}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--color-text-primary)] font-medium">
                        {formatCurrency(account.pipelineValue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sortable Table Header
// ---------------------------------------------------------------------------

function SortableHeader({
  label,
  field,
  currentField,
  currentDir,
  onSort,
  align = 'left',
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
}) {
  const isActive = currentField === field;
  return (
    <th
      className={`px-4 py-3 font-medium text-[var(--color-text-muted)] cursor-pointer select-none hover:text-[var(--color-text-primary)] transition-colors ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {align === 'right' && isActive && (
          <span className={`transition-transform ${currentDir === 'desc' ? 'rotate-180' : ''}`}>
            <SortIcon size={12} />
          </span>
        )}
        {label}
        {align === 'left' && isActive && (
          <span className={`transition-transform ${currentDir === 'desc' ? 'rotate-180' : ''}`}>
            <SortIcon size={12} />
          </span>
        )}
      </span>
    </th>
  );
}
