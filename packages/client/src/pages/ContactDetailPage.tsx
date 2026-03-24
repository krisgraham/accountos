import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SentimentDot, RoleBadge } from '../icons';
import { EngagementStatusBadge } from '../components/shared/EngagementStatusBadge';
import { RelationshipIntelLog } from '../components/shared/RelationshipIntelLog';
import { EngagementStrategyCard } from '../components/shared/EngagementStrategyCard';
import { useUIStore } from '../stores/uiStore';

interface ContactDetail {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  stakeholderRole: string | null;
  sentiment: string | null;
  influenceLevel: string | null;
  engagementStatus: string | null;
  engagementStatusNote: string | null;
  isKeyStakeholder: boolean;
  ourGoals: string | null;
  background: string | null;
  relationshipScore: number | null;
  organization: { id: string; name: string };
  department: { id: string; name: string } | null;
  reportsTo: { id: string; name: string; title: string | null } | null;
  directReports: { id: string; name: string; title: string | null }[];
  desires: { id: string; category: string; description: string; date: string }[];
  relationshipIntels: { id: string; category: string; description: string; date: string }[];
  engagementStrategies: { id: string; title: string; narrative: string | null; status: string; nextSteps: { id: string; type: string; date: string | null; notes: string | null; status: string }[] }[];
  nextSteps: { id: string; type: string; date: string | null; notes: string | null; status: string }[];
  projectMembers: { project: { id: string; name: string; type: string } }[];
}

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const { addToast } = useUIStore();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/contacts/${id}`)
      .then((r) => r.json())
      .then(setContact)
      .catch(() => setContact(null))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleKeyStakeholder = async () => {
    if (!contact) return;
    try {
      const res = await fetch(`/api/contacts/${contact.id}/key-stakeholder`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json();
        setContact({ ...contact, isKeyStakeholder: updated.isKeyStakeholder });
        addToast({
          type: 'success',
          message: updated.isKeyStakeholder ? 'Marked as key stakeholder' : 'Removed key stakeholder status',
        });
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to update' });
    }
  };

  if (loading) return <div className="p-6 text-[var(--color-text-muted)]">Loading...</div>;
  if (!contact) return <div className="p-6 text-[var(--color-text-muted)]">Contact not found</div>;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'activity', label: 'Activity' },
    { key: 'next-steps', label: 'Next Steps' },
    { key: 'projects', label: 'Projects' },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            {contact.name}
            {contact.isKeyStakeholder && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-900/30 text-amber-400 font-medium">KEY</span>
            )}
          </span>
        }
        subtitle={
          <span className="flex items-center gap-2">
            {contact.title && <span>{contact.title}</span>}
            {contact.organization && (
              <>
                <span className="text-[var(--color-text-muted)]">at</span>
                <Link to={`/accounts/${contact.organization.id}`} className="hover:text-[var(--color-accent)]">
                  {contact.organization.name}
                </Link>
              </>
            )}
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            {contact.sentiment && (
              <SentimentDot sentiment={contact.sentiment as Parameters<typeof SentimentDot>[0]['sentiment']} />
            )}
            {contact.engagementStatus && (
              <EngagementStatusBadge status={contact.engagementStatus} />
            )}
            {contact.stakeholderRole && (
              <RoleBadge role={contact.stakeholderRole as Parameters<typeof RoleBadge>[0]['role']} />
            )}
            <button
              onClick={toggleKeyStakeholder}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                contact.isKeyStakeholder
                  ? 'bg-amber-900/30 text-amber-400 hover:bg-amber-900/50'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
              }`}
              title={contact.isKeyStakeholder ? 'Remove key stakeholder' : 'Mark as key stakeholder'}
            >
              {contact.isKeyStakeholder ? 'Key Stakeholder' : 'Mark Key'}
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)] px-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'overview' && <OverviewTab contact={contact} setContact={setContact} />}
        {tab === 'activity' && <ActivityTab contact={contact} />}
        {tab === 'next-steps' && <NextStepsTab contact={contact} />}
        {tab === 'projects' && <ProjectsTab contact={contact} />}
      </div>
    </div>
  );
}

function OverviewTab({ contact, setContact }: { contact: ContactDetail; setContact: (c: ContactDetail) => void }) {
  return (
    <div className="space-y-6">
      {/* Quick info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {contact.influenceLevel && (
          <InfoCard label="Influence" value={contact.influenceLevel} />
        )}
        {contact.relationshipScore != null && (
          <InfoCard label="Relationship Score" value={String(contact.relationshipScore)} />
        )}
        {contact.email && (
          <InfoCard label="Email" value={contact.email} />
        )}
        {contact.phone && (
          <InfoCard label="Phone" value={contact.phone} />
        )}
      </div>

      {/* Engagement status note */}
      {contact.engagementStatusNote && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Engagement Note</h3>
          <p className="text-sm text-[var(--color-text-secondary)] p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            {contact.engagementStatusNote}
          </p>
        </div>
      )}

      {/* Our Goals (key stakeholders only) */}
      {contact.isKeyStakeholder && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Our Goals</h3>
          <p className="text-sm text-[var(--color-text-secondary)] p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            {contact.ourGoals || 'No goals defined yet for this key stakeholder.'}
          </p>
        </div>
      )}

      {/* Background */}
      {contact.background && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Background</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{contact.background}</p>
        </div>
      )}

      {/* Relationship Intel */}
      <RelationshipIntelLog
        contactId={contact.id}
        entries={contact.relationshipIntels}
        onAdd={(entry) => {
          setContact({
            ...contact,
            relationshipIntels: [entry, ...contact.relationshipIntels],
          });
        }}
      />

      {/* Desires */}
      {contact.desires.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Desires</h3>
          <div className="space-y-1.5">
            {contact.desires.map((d) => (
              <div key={d.id} className="p-2 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-accent)] uppercase">{d.category}</span>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reporting structure */}
      {(contact.reportsTo || contact.directReports.length > 0) && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Reporting Structure</h3>
          {contact.reportsTo && (
            <div className="text-xs text-[var(--color-text-muted)] mb-1">
              Reports to: <Link to={`/contacts/${contact.reportsTo.id}`} className="text-[var(--color-accent)] hover:underline">{contact.reportsTo.name}</Link> ({contact.reportsTo.title})
            </div>
          )}
          {contact.directReports.length > 0 && (
            <div className="text-xs text-[var(--color-text-muted)]">
              Direct reports: {contact.directReports.map((dr, i) => (
                <span key={dr.id}>
                  {i > 0 && ', '}
                  <Link to={`/contacts/${dr.id}`} className="text-[var(--color-accent)] hover:underline">{dr.name}</Link>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
      <div className="text-[10px] text-[var(--color-text-muted)] uppercase">{label}</div>
      <div className="text-xs text-[var(--color-text-primary)] mt-0.5 truncate">{value}</div>
    </div>
  );
}

function ActivityTab({ contact }: { contact: ContactDetail }) {
  return (
    <div className="text-sm text-[var(--color-text-muted)] text-center py-8">
      Activity timeline will show all communications involving {contact.name}.
    </div>
  );
}

function NextStepsTab({ contact }: { contact: ContactDetail }) {
  return (
    <div className="space-y-6">
      {/* Engagement Strategies */}
      {contact.engagementStrategies.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Engagement Strategies</h3>
          <div className="space-y-2">
            {contact.engagementStrategies.map((s) => (
              <EngagementStrategyCard key={s.id} strategy={s} />
            ))}
          </div>
        </div>
      )}

      {/* Standalone Next Steps (not under a strategy) */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Next Steps {contact.nextSteps.length > 0 && `(${contact.nextSteps.length})`}
        </h3>
        {contact.nextSteps.length === 0 ? (
          <div className="text-sm text-[var(--color-text-muted)] text-center py-4">No standalone next steps</div>
        ) : (
          <div className="space-y-1">
            {contact.nextSteps.map((ns) => (
              <div key={ns.id} className="p-2 rounded-md bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]">{ns.type}</span>
                  {ns.date && <span className="text-xs text-[var(--color-text-muted)]">{new Date(ns.date).toLocaleDateString()}</span>}
                  <span className={`text-xs ml-auto ${ns.status === 'COMPLETED' ? 'text-[var(--color-rag-healthy)]' : 'text-[var(--color-text-muted)]'}`}>{ns.status}</span>
                </div>
                {ns.notes && <div className="text-xs text-[var(--color-text-secondary)] mt-1">{ns.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsTab({ contact }: { contact: ContactDetail }) {
  if (contact.projectMembers.length === 0) {
    return <div className="text-sm text-[var(--color-text-muted)] text-center py-8">Not tagged on any projects</div>;
  }
  return (
    <div className="space-y-2">
      {contact.projectMembers.map((pm) => (
        <Link
          key={pm.project.id}
          to={`/projects/${pm.project.id}`}
          className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">{pm.project.type}</span>
          <span className="text-sm text-[var(--color-text-primary)]">{pm.project.name}</span>
        </Link>
      ))}
    </div>
  );
}
