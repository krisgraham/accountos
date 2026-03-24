import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { CloseIcon } from '../../icons';

interface ContactOption {
  id: string;
  name: string;
}

const COMM_TYPES = [
  { value: 'IN_PERSON', label: 'In-Person' },
  { value: 'VIDEO_CALL', label: 'Video Call' },
  { value: 'PHONE_CALL', label: 'Phone Call' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'COFFEE_MEAL', label: 'Coffee/Meal' },
  { value: 'MESSAGE', label: 'Message' },
  { value: 'CONFERENCE', label: 'Conference' },
];

export function LogCommunicationModal() {
  const { logCommunicationOpen, closeLogCommunication, addToast } = useUIStore();
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [type, setType] = useState('VIDEO_CALL');
  const [participantSearch, setParticipantSearch] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<ContactOption[]>([]);
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (logCommunicationOpen) {
      fetch('/api/contacts?limit=100')
        .then((r) => r.json())
        .then((res) => setContacts(res.data || []));
    }
  }, [logCommunicationOpen]);

  if (!logCommunicationOpen) return null;

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(participantSearch.toLowerCase()) &&
      !selectedParticipants.some((p) => p.id === c.id),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedParticipants.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          summary: summary.trim() || undefined,
          participantIds: selectedParticipants.map((p) => p.id),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      addToast({ type: 'success', message: 'Communication logged' });
      setType('VIDEO_CALL');
      setSelectedParticipants([]);
      setSummary('');
      closeLogCommunication();
    } catch {
      addToast({ type: 'error', message: 'Failed to log communication' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeLogCommunication}
      data-testid="log-communication-modal"
    >
      <div
        className="w-full max-w-md bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Log Communication</h2>
          <button onClick={closeLogCommunication} className="p-1 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
            <CloseIcon size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Type</label>
            <div className="flex flex-wrap gap-1.5" data-testid="comm-type-select">
              {COMM_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => setType(ct.value)}
                  data-testid={`comm-type-${ct.value.toLowerCase().replace(/_/g, '-')}`}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    type === ct.value
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Participants *</label>
            {selectedParticipants.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedParticipants.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs">
                    {p.name}
                    <button type="button" onClick={() => setSelectedParticipants((prev) => prev.filter((x) => x.id !== p.id))}>
                      <CloseIcon size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="Search contacts..."
              value={participantSearch}
              onChange={(e) => setParticipantSearch(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              data-testid="participant-search"
            />
            {participantSearch && filteredContacts.length > 0 && (
              <div className="mt-1 max-h-32 overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
                {filteredContacts.slice(0, 5).map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    data-testid={`participant-option-${i}`}
                    onClick={() => {
                      setSelectedParticipants((prev) => [...prev, c]);
                      setParticipantSearch('');
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
              data-testid="comm-summary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeLogCommunication}
              className="px-3 py-1.5 rounded-md text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedParticipants.length === 0 || saving}
              className="px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
              data-testid="comm-save-button"
            >
              {saving ? 'Saving...' : 'Log Communication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
