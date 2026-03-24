import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PlusIcon } from '../icons';

interface MeetingNote {
  id: string;
  date: string;
  meetingType: string | null;
  summary: string | null;
  project: { id: string; name: string } | null;
  attendees: { contact: { id: string; name: string } }[];
  _count: { actionItems: number; personNotes: number };
}

export function MeetingNotesPage() {
  const [notes, setNotes] = useState<MeetingNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/meeting-notes')
      .then((r) => r.json())
      .then((res) => setNotes(res.data || []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Meeting Notes"
        subtitle="Per-person capture and action items"
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] transition-colors">
            <PlusIcon size={16} />
            New Meeting Note
          </button>
        }
      />
      <div className="p-6">
        {loading ? (
          <div className="text-[var(--color-text-muted)] text-sm">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            No meeting notes yet. Press Cmd+M to capture your first meeting.
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((n) => (
              <Link
                key={n.id}
                to={`/meeting-notes/${n.id}`}
                className="block p-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {new Date(n.date).toLocaleDateString()}
                  </span>
                  {n.meetingType && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                      {n.meetingType}
                    </span>
                  )}
                </div>
                {n.summary && (
                  <div className="text-sm text-[var(--color-text-primary)] mt-1">{n.summary}</div>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-text-muted)]">
                  <span>{n.attendees.map((a) => a.contact.name).join(', ')}</span>
                  <span>{n._count.actionItems} actions</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
