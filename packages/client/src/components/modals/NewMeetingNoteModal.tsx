import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { CloseIcon } from '../../icons';

interface ContactOption {
  id: string;
  name: string;
}

export function NewMeetingNoteModal() {
  const { newMeetingNoteOpen, closeNewMeetingNote, addToast } = useUIStore();
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [meetingType, setMeetingType] = useState('');
  const [summary, setSummary] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<ContactOption[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (newMeetingNoteOpen) {
      fetch('/api/contacts?limit=100')
        .then((r) => r.json())
        .then((res) => setContacts(res.data || []));
    }
  }, [newMeetingNoteOpen]);

  if (!newMeetingNoteOpen) return null;

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(attendeeSearch.toLowerCase()) &&
      !selectedAttendees.some((a) => a.id === c.id),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/meeting-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingType: meetingType || undefined,
          summary: summary.trim() || undefined,
          attendeeIds: selectedAttendees.map((a) => a.id),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      addToast({ type: 'success', message: 'Meeting note created' });
      setMeetingType('');
      setSummary('');
      setSelectedAttendees([]);
      closeNewMeetingNote();
    } catch {
      addToast({ type: 'error', message: 'Failed to create meeting note' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeNewMeetingNote}
      data-testid="new-meeting-note-modal"
    >
      <div
        className="w-full max-w-md bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">New Meeting Note</h2>
          <button onClick={closeNewMeetingNote} className="p-1 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
            <CloseIcon size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Meeting Type</label>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            >
              <option value="">Select type...</option>
              <option value="Discovery">Discovery</option>
              <option value="Technical Review">Technical Review</option>
              <option value="Executive Briefing">Executive Briefing</option>
              <option value="Project Kickoff">Project Kickoff</option>
              <option value="Status Update">Status Update</option>
              <option value="QBR">QBR</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Attendees</label>
            {selectedAttendees.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedAttendees.map((a) => (
                  <span key={a.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs">
                    {a.name}
                    <button type="button" onClick={() => setSelectedAttendees((prev) => prev.filter((x) => x.id !== a.id))}>
                      <CloseIcon size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="Search attendees..."
              value={attendeeSearch}
              onChange={(e) => setAttendeeSearch(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
            {attendeeSearch && filtered.length > 0 && (
              <div className="mt-1 max-h-32 overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
                {filtered.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedAttendees((prev) => [...prev, c]);
                      setAttendeeSearch('');
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeNewMeetingNote}
              className="px-3 py-1.5 rounded-md text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
