import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { PlusIcon } from '../icons';

interface Communication {
  id: string;
  type: string;
  date: string;
  summary: string | null;
  participants: { contact: { id: string; name: string } }[];
}

export function CommunicationsPage() {
  const [comms, setComms] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/communications')
      .then((r) => r.json())
      .then((res) => setComms(res.data || []))
      .catch(() => setComms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Communications"
        subtitle="Activity log across all stakeholders"
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] transition-colors">
            <PlusIcon size={16} />
            Log Communication
          </button>
        }
      />
      <div className="p-6">
        {loading ? (
          <div className="text-[var(--color-text-muted)] text-sm">Loading...</div>
        ) : comms.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            No communications logged yet. Press Cmd+L to log your first interaction.
          </div>
        ) : (
          <div className="space-y-2">
            {comms.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    {c.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {new Date(c.date).toLocaleDateString()}
                  </span>
                </div>
                {c.summary && (
                  <div className="text-sm text-[var(--color-text-primary)] mt-1">{c.summary}</div>
                )}
                <div className="text-xs text-[var(--color-text-muted)] mt-1">
                  {c.participants.map((p) => p.contact.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
