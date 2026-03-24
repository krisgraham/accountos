import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SentimentDot, RoleBadge, SearchIcon, FilterIcon, UsersIcon } from '../../icons';
import { EngagementStatusBadge } from './EngagementStatusBadge';

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
  organization?: { id: string; name: string };
}

interface PeopleViewProps {
  contacts: Contact[];
  defaultView?: 'list' | 'chart';
  showOrgFilter?: boolean;
  orgChartContent?: React.ReactNode;
}

const STORAGE_KEY_PREFIX = 'accountos-people-view-';

export function PeopleView({ contacts, defaultView = 'list', showOrgFilter = false, orgChartContent }: PeopleViewProps) {
  const storageKey = STORAGE_KEY_PREFIX + (showOrgFilter ? 'cross' : 'account');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>(() => {
    const stored = localStorage.getItem(storageKey);
    return (stored === 'list' || stored === 'chart') ? stored : defaultView;
  });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [keyOnly, setKeyOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, viewMode);
  }, [viewMode, storageKey]);

  const filtered = contacts.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.title?.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && c.stakeholderRole !== roleFilter) return false;
    if (sentimentFilter && c.sentiment !== sentimentFilter) return false;
    if (keyOnly && !c.isKeyStakeholder) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border)] mb-3">
        {/* View toggle */}
        <div className="flex rounded-md border border-[var(--color-border)] overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 text-xs ${viewMode === 'list' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'}`}
          >
            <UsersIcon size={14} />
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-2.5 py-1 text-xs ${viewMode === 'chart' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="3" /><line x1="12" y1="8" x2="12" y2="14" /><circle cx="6" cy="19" r="3" /><circle cx="18" cy="19" r="3" /><line x1="12" y1="14" x2="6" y2="16" /><line x1="12" y1="14" x2="18" y2="16" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex-1 max-w-xs">
          <SearchIcon size={14} className="text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none w-full"
          />
        </div>

        {/* Key stakeholder toggle */}
        <button
          onClick={() => setKeyOnly(!keyOnly)}
          className={`px-2 py-1 rounded text-xs ${keyOnly ? 'bg-amber-900/30 text-amber-400' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'}`}
        >
          Key Only
        </button>

        <span className="text-xs text-[var(--color-text-muted)] ml-auto">
          {filtered.length} of {contacts.length}
        </span>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="flex-1 overflow-auto space-y-1">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/contacts/${c.id}`}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0 relative"
                style={{ backgroundColor: c.department?.colorCode || 'var(--color-accent)' }}
              >
                {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                {c.isKeyStakeholder && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-500 border border-[var(--color-surface)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {c.name}
                  {c.isKeyStakeholder && <span className="ml-1 text-amber-400 text-[10px]">KEY</span>}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] truncate">
                  {c.title}
                  {showOrgFilter && c.organization && ` at ${c.organization.name}`}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {c.engagementStatus && <EngagementStatusBadge status={c.engagementStatus} />}
                {c.stakeholderRole && (
                  <RoleBadge role={c.stakeholderRole as Parameters<typeof RoleBadge>[0]['role']} />
                )}
                {c.sentiment && (
                  <SentimentDot sentiment={c.sentiment as Parameters<typeof SentimentDot>[0]['sentiment']} />
                )}
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-[var(--color-text-muted)] text-center py-8">
              No contacts match your filters
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1">
          {orgChartContent || (
            <div className="text-sm text-[var(--color-text-muted)] text-center py-8">
              Select an account to view the org chart
            </div>
          )}
        </div>
      )}
    </div>
  );
}
