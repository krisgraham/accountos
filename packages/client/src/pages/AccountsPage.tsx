import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PlusIcon, RAGStatus, SearchIcon, FilterIcon } from '../icons';

interface Organization {
  id: string;
  name: string;
  industry: string | null;
  healthStatus: string;
  healthScore: number | null;
  _count: { contacts: number; departments: number; projects: number };
}

export function AccountsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (healthFilter) params.set('healthStatus', healthFilter);
    fetch(`/api/organizations?${params}`)
      .then((r) => r.json())
      .then((res) => setOrgs(res.data || []))
      .catch(() => setOrgs([]))
      .finally(() => setLoading(false));
  }, [search, healthFilter]);

  return (
    <div>
      <PageHeader
        title="Accounts"
        subtitle="Manage customer organizations"
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] transition-colors">
            <PlusIcon size={16} />
            New Account
          </button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex-1 max-w-xs">
          <SearchIcon size={14} className="text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <FilterIcon size={14} className="text-[var(--color-text-muted)]" />
          {['', 'HEALTHY', 'MONITOR', 'AT_RISK'].map((status) => (
            <button
              key={status}
              onClick={() => setHealthFilter(status)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                healthFilter === status
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {status ? status.replace(/_/g, ' ') : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-[var(--color-text-muted)] text-sm">Loading...</div>
        ) : orgs.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            {search || healthFilter ? 'No accounts match your filters.' : 'No accounts yet. Create your first account to get started.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgs.map((org) => (
              <Link
                key={org.id}
                to={`/accounts/${org.id}`}
                className="p-4 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">
                    {org.name}
                  </div>
                  <RAGStatus status={org.healthStatus as 'HEALTHY' | 'MONITOR' | 'AT_RISK'} />
                </div>
                {org.industry && (
                  <div className="text-xs text-[var(--color-text-muted)] mb-2">{org.industry}</div>
                )}
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                  <span>{org._count.contacts} contacts</span>
                  <span>{org._count.projects} projects</span>
                  <span>{org._count.departments} depts</span>
                </div>
                {org.healthScore != null && (
                  <div className="mt-2">
                    <div className="w-full h-1 rounded-full bg-[var(--color-surface)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${org.healthScore}%`,
                          backgroundColor: org.healthScore >= 70 ? 'var(--color-rag-healthy)' : org.healthScore >= 40 ? 'var(--color-rag-monitor)' : 'var(--color-rag-at-risk)',
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Score: {org.healthScore}</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
