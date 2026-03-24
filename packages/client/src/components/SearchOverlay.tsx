import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';
import { SearchIcon, CloseIcon } from '../icons';

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50"
      onClick={closeSearch}
      data-testid="search-overlay"
    >
      <div
        className="w-full max-w-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
          <SearchIcon size={18} className="text-[var(--color-text-muted)]" />
          <input
            autoFocus
            type="text"
            placeholder="Search contacts, accounts, projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeSearch();
            }}
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
            data-testid="search-input"
          />
          <button
            onClick={closeSearch}
            className="p-1 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
          >
            <CloseIcon size={16} />
          </button>
        </div>
        <div className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
          {query ? `No results for "${query}"` : 'Start typing to search...'}
        </div>
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
          <span>
            <kbd className="px-1 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
