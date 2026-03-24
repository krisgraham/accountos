import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SentimentDot, RoleBadge } from '../icons';

interface Department {
  id: string;
  name: string;
  description: string | null;
  colorCode: string | null;
  missionFocus: string | null;
  strategicPriorities: string | null;
  budgetCycleStart: string | null;
  budgetCycleEnd: string | null;
  keyInitiatives: string | null;
  organization: { id: string; name: string };
  contacts: {
    id: string;
    name: string;
    title: string | null;
    stakeholderRole: string | null;
    sentiment: string | null;
  }[];
  _count: { contacts: number; projects: number };
}

export function DepartmentDetailPage() {
  const { id: orgId, deptId } = useParams<{ id: string; deptId: string }>();
  const [dept, setDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingMission, setEditingMission] = useState(false);
  const [missionDraft, setMissionDraft] = useState('');

  useEffect(() => {
    if (!deptId) return;
    fetch(`/api/departments/${deptId}`)
      .then((r) => r.json())
      .then((data) => {
        setDept(data);
        setMissionDraft(data.missionFocus || '');
      })
      .catch(() => setDept(null))
      .finally(() => setLoading(false));
  }, [deptId]);

  const coverageScore = useMemo(() => {
    if (!dept) return 0;
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    // Simple coverage: percentage of contacts that have a stakeholder role assigned
    const withRole = dept.contacts.filter((c) => c.stakeholderRole);
    if (dept.contacts.length === 0) return 0;
    return Math.round((withRole.length / dept.contacts.length) * 100);
  }, [dept]);

  const saveMission = async () => {
    if (!dept) return;
    await fetch(`/api/departments/${dept.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionFocus: missionDraft }),
    });
    setDept({ ...dept, missionFocus: missionDraft });
    setEditingMission(false);
  };

  if (loading) return <div className="p-6 text-[var(--color-text-muted)]">Loading...</div>;
  if (!dept) return <div className="p-6 text-[var(--color-text-muted)]">Department not found</div>;

  let priorities: string[] = [];
  try {
    priorities = dept.strategicPriorities ? JSON.parse(dept.strategicPriorities) : [];
  } catch {
    priorities = dept.strategicPriorities ? [dept.strategicPriorities] : [];
  }

  let initiatives: string[] = [];
  try {
    initiatives = dept.keyInitiatives ? JSON.parse(dept.keyInitiatives) : [];
  } catch {
    initiatives = dept.keyInitiatives ? [dept.keyInitiatives] : [];
  }

  return (
    <div>
      <PageHeader
        title={dept.name}
        subtitle={
          <span className="flex items-center gap-2">
            <Link to={`/accounts/${orgId}`} className="hover:text-[var(--color-accent)]">
              {dept.organization.name}
            </Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span>{dept.name}</span>
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            {dept.colorCode && (
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: dept.colorCode }} />
            )}
            <span className="text-sm text-[var(--color-text-muted)]">
              Coverage: {coverageScore}%
            </span>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <div className="text-sm text-[var(--color-text-muted)]">Contacts</div>
            <div className="text-2xl font-semibold text-[var(--color-text-primary)] mt-1">{dept._count.contacts}</div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <div className="text-sm text-[var(--color-text-muted)]">Projects</div>
            <div className="text-2xl font-semibold text-[var(--color-text-primary)] mt-1">{dept._count.projects}</div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <div className="text-sm text-[var(--color-text-muted)]">Role Coverage</div>
            <div className="text-2xl font-semibold text-[var(--color-text-primary)] mt-1">{coverageScore}%</div>
            <div className="mt-1 w-full h-1.5 rounded-full bg-[var(--color-surface)]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${coverageScore}%`,
                  backgroundColor: coverageScore >= 70 ? 'var(--color-rag-healthy)' : coverageScore >= 40 ? 'var(--color-rag-monitor)' : 'var(--color-rag-at-risk)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Brief */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Mission / Focus</h3>
                <button
                  onClick={() => {
                    if (editingMission) saveMission();
                    else setEditingMission(true);
                  }}
                  className="text-xs text-[var(--color-accent)] hover:underline"
                >
                  {editingMission ? 'Save' : 'Edit'}
                </button>
              </div>
              {editingMission ? (
                <textarea
                  value={missionDraft}
                  onChange={(e) => setMissionDraft(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] resize-none"
                />
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {dept.missionFocus || 'No mission/focus defined yet.'}
                </p>
              )}
            </div>

            {priorities.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Strategic Priorities</h3>
                <ul className="space-y-1">
                  {priorities.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {initiatives.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Key Initiatives</h3>
                <ul className="space-y-1">
                  {initiatives.map((ini, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-rag-monitor)] mt-1.5 shrink-0" />
                      {ini}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(dept.budgetCycleStart || dept.budgetCycleEnd) && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Budget Cycle</h3>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {dept.budgetCycleStart && new Date(dept.budgetCycleStart).toLocaleDateString()}
                  {dept.budgetCycleStart && dept.budgetCycleEnd && ' - '}
                  {dept.budgetCycleEnd && new Date(dept.budgetCycleEnd).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* Contacts in Department */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Contacts ({dept.contacts.length})
            </h3>
            <div className="space-y-1">
              {dept.contacts.map((c) => (
                <Link
                  key={c.id}
                  to={`/contacts/${c.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0"
                    style={{ backgroundColor: dept.colorCode || 'var(--color-accent)' }}
                  >
                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--color-text-primary)] truncate">{c.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)] truncate">{c.title}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {c.stakeholderRole && (
                      <RoleBadge role={c.stakeholderRole as Parameters<typeof RoleBadge>[0]['role']} />
                    )}
                    {c.sentiment && (
                      <SentimentDot sentiment={c.sentiment as Parameters<typeof SentimentDot>[0]['sentiment']} />
                    )}
                  </div>
                </Link>
              ))}
              {dept.contacts.length === 0 && (
                <div className="text-sm text-[var(--color-text-muted)] text-center py-4">No contacts in this department</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
