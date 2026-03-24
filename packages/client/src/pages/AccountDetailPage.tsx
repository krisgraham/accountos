import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RAGStatus, PlusIcon } from '../icons';
import { KeyStakeholderCompactCard } from '../components/shared/KeyStakeholderCompactCard';
import { ProjectSummaryCard } from '../components/shared/ProjectSummaryCard';
import { EngagementStatusBadge } from '../components/shared/EngagementStatusBadge';
import { PeopleView } from '../components/shared/PeopleView';
import { CoverageMatrix } from '../components/shared/CoverageMatrix';
import { RelationshipIntelLog } from '../components/shared/RelationshipIntelLog';
import { EngagementStrategyCard } from '../components/shared/EngagementStrategyCard';

interface Organization {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  description: string | null;
  healthStatus: string;
  healthScore: number | null;
  departments: { id: string; name: string; colorCode: string | null }[];
  _count: { contacts: number; projects: number };
}

interface Contact {
  id: string;
  name: string;
  title: string | null;
  stakeholderRole: string | null;
  sentiment: string | null;
  engagementStatus: string | null;
  isKeyStakeholder: boolean;
  influenceLevel: string | null;
  updatedAt: string;
  department: { id: string; name: string; colorCode: string | null } | null;
  reportsToId: string | null;
}

interface Project {
  id: string;
  name: string;
  type: string;
  stage: string | null;
  healthStatus: string;
  contractStatus: string | null;
  estimatedValue: number | null;
  winLikelihood: number | null;
  coverageScore: number | null;
  _count: { members: number };
  members?: { contact: { id: string; name: string } }[];
}

interface Communication {
  id: string;
  type: string;
  date: string;
  summary: string | null;
  participants: { contact: { id: string; name: string } }[];
}

interface KeyStakeholderFull {
  id: string;
  name: string;
  title: string | null;
  sentiment: string | null;
  engagementStatus: string | null;
  ourGoals: string | null;
  updatedAt: string;
  department: { id: string; name: string; colorCode: string | null } | null;
  desires: { id: string; category: string; description: string }[];
  relationshipIntels: { id: string; category: string; description: string; date: string }[];
  engagementStrategies: { id: string; title: string; narrative: string | null; status: string; nextSteps: { id: string; type: string; date: string | null; notes: string | null; status: string }[] }[];
  projectMembers: { project: { id: string; name: string; type: string; healthStatus: string; stage: string | null } }[];
  teamAffinities: { teamMember: { id: string; name: string; role: string | null } }[];
}

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'people', label: 'People' },
  { key: 'key-stakeholders', label: 'Key Stakeholders' },
  { key: 'projects', label: 'Projects' },
  { key: 'communications', label: 'Communications' },
  { key: 'departments', label: 'Departments' },
  { key: 'tech-stack', label: 'Tech Stack' },
  { key: 'health', label: 'Health' },
];

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [org, setOrg] = useState<Organization | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [comms, setComms] = useState<Communication[]>([]);
  const [keyStakeholders, setKeyStakeholders] = useState<KeyStakeholderFull[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/organizations/${id}`).then((r) => r.json()),
      fetch(`/api/organizations/${id}/contacts`).then((r) => r.json()),
      fetch(`/api/organizations/${id}/projects`).then((r) => r.json()),
      fetch(`/api/communications?limit=10`).then((r) => r.json()),
      fetch(`/api/organizations/${id}/key-stakeholders`).then((r) => r.json()),
    ])
      .then(([orgData, contactList, projectList, commData, ks]) => {
        setOrg(orgData);
        setContacts(contactList || []);
        setProjects(projectList || []);
        setComms((commData.data || []).filter((c: Communication) =>
          c.participants.some((p) => (contactList || []).some((ct: Contact) => ct.id === p.contact.id))
        ));
        setKeyStakeholders(ks || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const pipelineValue = useMemo(
    () => projects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0),
    [projects],
  );

  if (loading) return <div className="p-6 text-[var(--color-text-muted)]">Loading...</div>;
  if (!org) return <div className="p-6 text-[var(--color-text-muted)]">Account not found</div>;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={org.name}
        subtitle={org.industry || 'Account'}
        actions={
          <div className="flex items-center gap-2">
            <RAGStatus status={org.healthStatus as 'HEALTHY' | 'MONITOR' | 'AT_RISK'} />
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)] px-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSearchParams({ tab: tab.key })}
            className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && (
          <OverviewTab org={org} contacts={contacts} projects={projects} comms={comms} keyStakeholders={keyStakeholders} pipelineValue={pipelineValue} />
        )}
        {activeTab === 'people' && (
          <PeopleView contacts={contacts} defaultView="chart" orgChartContent={
            <div className="text-center py-4">
              <Link to={`/accounts/${id}/org-chart`} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)]">
                Open Full Org Chart
              </Link>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">{contacts.length} contacts in this organization</p>
            </div>
          } />
        )}
        {activeTab === 'key-stakeholders' && <KeyStakeholdersTab stakeholders={keyStakeholders} />}
        {activeTab === 'projects' && <ProjectsTab projects={projects} />}
        {activeTab === 'communications' && <CommunicationsTab comms={comms} />}
        {activeTab === 'departments' && <DepartmentsTab departments={org.departments} orgId={id!} contacts={contacts} />}
        {activeTab === 'tech-stack' && <PlaceholderTab title="Tech Stack" message="Technology stack mapping will be available in Phase 2." />}
        {activeTab === 'health' && <PlaceholderTab title="Health Trends" message="Health trend charts will be available in Phase 2." />}
      </div>
    </div>
  );
}

function OverviewTab({ org, contacts, projects, comms, keyStakeholders, pipelineValue }: {
  org: Organization; contacts: Contact[]; projects: Project[]; comms: Communication[]; keyStakeholders: KeyStakeholderFull[]; pipelineValue: number;
}) {
  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPICard label="Health Score" value={org.healthScore ?? '--'} />
        <KPICard label="Contacts" value={contacts.length} />
        <KPICard label="Active Projects" value={projects.length} />
        <KPICard label="Pipeline" value={`$${(pipelineValue / 1000).toFixed(0)}K`} />
        <KPICard label="Key Stakeholders" value={keyStakeholders.length} />
      </div>

      {/* Key Stakeholders Strip */}
      {keyStakeholders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Key Stakeholders</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {keyStakeholders.map((ks) => (
              <KeyStakeholderCompactCard key={ks.id} stakeholder={ks} />
            ))}
          </div>
        </div>
      )}

      {/* Projects Overview */}
      {projects.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.map((p) => (
              <ProjectSummaryCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Recent Activity</h3>
        {comms.length === 0 ? (
          <div className="text-sm text-[var(--color-text-muted)] text-center py-4">No recent activity</div>
        ) : (
          <div className="space-y-2">
            {comms.slice(0, 8).map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]">{c.type.replace(/_/g, ' ')}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{new Date(c.date).toLocaleDateString()}</span>
                </div>
                {c.summary && <div className="text-sm text-[var(--color-text-secondary)] truncate">{c.summary}</div>}
                <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{c.participants.map((p) => p.contact.name).join(', ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insights placeholder */}
      <div className="p-4 rounded-lg border border-dashed border-[var(--color-border)] text-center">
        <div className="text-sm text-[var(--color-text-muted)]">AI Insights will appear here in Phase 2</div>
      </div>
    </div>
  );
}

function KPICard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
      <div className="text-xs text-[var(--color-text-muted)]">{label}</div>
      <div className="text-xl font-semibold text-[var(--color-text-primary)] mt-0.5">{value}</div>
    </div>
  );
}

function KeyStakeholdersTab({ stakeholders }: { stakeholders: KeyStakeholderFull[] }) {
  if (stakeholders.length === 0) {
    return <div className="text-sm text-[var(--color-text-muted)] text-center py-8">No key stakeholders marked. Use the contact profile to mark contacts as key stakeholders.</div>;
  }

  return (
    <div className="space-y-4">
      {stakeholders.map((ks) => (
        <div key={ks.id} className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Column 1: Relationship Health */}
            <div>
              <Link to={`/contacts/${ks.id}`} className="text-sm font-semibold text-[var(--color-accent)] hover:underline">{ks.name}</Link>
              <div className="text-xs text-[var(--color-text-muted)]">{ks.title}</div>
              <div className="mt-2 space-y-1">
                {ks.engagementStatus && <EngagementStatusBadge status={ks.engagementStatus} />}
                {ks.teamAffinities?.[0] && (
                  <div className="text-xs text-[var(--color-text-muted)]">Team: {ks.teamAffinities[0].teamMember.name}</div>
                )}
              </div>
            </div>

            {/* Column 2: Their World */}
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">Their World</div>
              {ks.desires.length > 0 && (
                <div className="space-y-1">
                  {ks.desires.slice(0, 2).map((d) => (
                    <div key={d.id} className="text-xs text-[var(--color-text-secondary)]">
                      <span className="text-[var(--color-accent)]">{d.category}</span>: {d.description}
                    </div>
                  ))}
                </div>
              )}
              {ks.relationshipIntels.length > 0 && (
                <div className="mt-1 space-y-1">
                  {ks.relationshipIntels.slice(0, 2).map((ri) => (
                    <div key={ri.id} className="text-xs text-[var(--color-text-secondary)]">
                      <span className="text-[var(--color-rag-monitor)]">{ri.category.replace(/_/g, ' ')}</span>: {ri.description}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Our Engagement */}
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">Our Engagement</div>
              {ks.ourGoals && <p className="text-xs text-[var(--color-text-secondary)] mb-1">{ks.ourGoals}</p>}
              {ks.projectMembers.length > 0 && (
                <div className="space-y-0.5">
                  {ks.projectMembers.map((pm) => (
                    <div key={pm.project.id} className="flex items-center gap-1 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pm.project.healthStatus === 'HEALTHY' ? 'var(--color-rag-healthy)' : pm.project.healthStatus === 'MONITOR' ? 'var(--color-rag-monitor)' : 'var(--color-rag-at-risk)' }} />
                      <span className="text-[var(--color-text-secondary)]">{pm.project.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {ks.engagementStrategies.length > 0 && (
                <div className="mt-1">
                  {ks.engagementStrategies.map((s) => (
                    <div key={s.id} className="text-[10px] text-[var(--color-accent)]">{s.title} ({s.status})</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsTab({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <div className="text-sm text-[var(--color-text-muted)] text-center py-8">No projects for this account</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {projects.map((p) => <ProjectSummaryCard key={p.id} project={p} />)}
    </div>
  );
}

function CommunicationsTab({ comms }: { comms: Communication[] }) {
  if (comms.length === 0) return <div className="text-sm text-[var(--color-text-muted)] text-center py-8">No communications logged</div>;
  return (
    <div className="space-y-2">
      {comms.map((c) => (
        <div key={c.id} className="p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]">{c.type.replace(/_/g, ' ')}</span>
            <span className="text-xs text-[var(--color-text-muted)]">{new Date(c.date).toLocaleDateString()}</span>
          </div>
          {c.summary && <div className="text-sm text-[var(--color-text-secondary)]">{c.summary}</div>}
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{c.participants.map((p) => p.contact.name).join(', ')}</div>
        </div>
      ))}
    </div>
  );
}

function DepartmentsTab({ departments, orgId, contacts }: { departments: Organization['departments']; orgId: string; contacts: Contact[] }) {
  if (departments.length === 0) return <div className="text-sm text-[var(--color-text-muted)] text-center py-8">No departments</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {departments.map((d) => {
        const deptContacts = contacts.filter((c) => c.department?.id === d.id);
        return (
          <Link key={d.id} to={`/accounts/${orgId}/departments/${d.id}`} className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              {d.colorCode && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.colorCode }} />}
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{d.name}</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">{deptContacts.length} contacts</div>
          </Link>
        );
      })}
    </div>
  );
}

function PlaceholderTab({ title, message }: { title: string; message: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-sm font-medium text-[var(--color-text-primary)] mb-1">{title}</div>
      <div className="text-sm text-[var(--color-text-muted)]">{message}</div>
    </div>
  );
}
