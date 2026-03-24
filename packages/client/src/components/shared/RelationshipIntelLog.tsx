import { useState } from 'react';
import { PlusIcon } from '../../icons';
import { useUIStore } from '../../stores/uiStore';

interface IntelEntry {
  id: string;
  category: string;
  description: string;
  date: string;
  createdBy?: string | null;
}

interface RelationshipIntelLogProps {
  contactId: string;
  entries: IntelEntry[];
  onAdd?: (entry: IntelEntry) => void;
}

const CATEGORIES = ['PERCEPTION', 'HISTORY', 'RISK_SIGNAL', 'COMPETITIVE_INTEL'];
const CATEGORY_COLORS: Record<string, string> = {
  PERCEPTION: 'var(--color-accent)',
  HISTORY: 'var(--color-dept-2)',
  RISK_SIGNAL: 'var(--color-rag-at-risk)',
  COMPETITIVE_INTEL: 'var(--color-rag-monitor)',
};

export function RelationshipIntelLog({ contactId, entries, onAdd }: RelationshipIntelLogProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('PERCEPTION');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const { addToast } = useUIStore();

  const filtered = filter ? entries.filter((e) => e.category === filter) : entries;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/contacts/${contactId}/relationship-intel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, description: description.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      const entry = await res.json();
      onAdd?.(entry);
      setDescription('');
      setShowForm(false);
      addToast({ type: 'success', message: 'Relationship intel added' });
    } catch {
      addToast({ type: 'error', message: 'Failed to add intel' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Relationship Intel</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
        >
          <PlusIcon size={12} />
          Add
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => setFilter('')}
          className={`px-1.5 py-0.5 rounded text-[10px] ${!filter ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'}`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(filter === cat ? '' : cat)}
            className={`px-1.5 py-0.5 rounded text-[10px] ${filter === cat ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'}`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-3 mb-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-2 py-1 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What have we learned about how they perceive us?"
            rows={2}
            className="w-full px-2 py-1 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] outline-none resize-none"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-[var(--color-text-muted)]">Cancel</button>
            <button type="submit" disabled={!description.trim() || saving} className="px-2 py-1 rounded bg-[var(--color-accent)] text-white text-xs disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* Entries */}
      <div className="space-y-1.5">
        {filtered.map((entry) => (
          <div key={entry.id} className="p-2 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  color: CATEGORY_COLORS[entry.category] || 'var(--color-text-muted)',
                  backgroundColor: `${CATEGORY_COLORS[entry.category] || 'var(--color-text-muted)'}20`,
                }}
              >
                {entry.category.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)]">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{entry.description}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-[var(--color-text-muted)] text-center py-3">
            No relationship intel recorded yet
          </div>
        )}
      </div>
    </div>
  );
}
