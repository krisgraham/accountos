import { useEffect, useState } from 'react';
import { CloseIcon } from '../../icons';

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
  background: string | null;
  relationshipScore: number | null;
  organization: { id: string; name: string };
  department: { id: string; name: string } | null;
  desires: { id: string; category: string; description: string }[];
  relationshipIntels: { id: string; category: string; description: string }[];
}

interface ContactSlideOverProps {
  contactId: string | null;
  onClose: () => void;
}

export function ContactSlideOver({ contactId, onClose }: ContactSlideOverProps) {
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contactId) {
      setContact(null);
      return;
    }
    setLoading(true);
    fetch(`/api/contacts/${contactId}`)
      .then((r) => r.json())
      .then(setContact)
      .catch(() => setContact(null))
      .finally(() => setLoading(false));
  }, [contactId]);

  if (!contactId) return null;

  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-[400px] bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl z-40 overflow-y-auto"
      data-testid="contact-slide-over"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
          {loading ? 'Loading...' : contact?.name || 'Contact'}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
        >
          <CloseIcon size={16} />
        </button>
      </div>

      {loading ? (
        <div className="p-4 text-sm text-[var(--color-text-muted)]">Loading contact...</div>
      ) : contact ? (
        <div className="p-4 space-y-4">
          {/* Header */}
          <div>
            <div className="text-lg font-semibold text-[var(--color-text-primary)]">{contact.name}</div>
            <div className="text-sm text-[var(--color-text-muted)]">
              {contact.title} {contact.organization && `at ${contact.organization.name}`}
            </div>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-2">
            {contact.stakeholderRole && (
              <div className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Role</div>
                <div className="text-xs text-[var(--color-text-primary)]">
                  {contact.stakeholderRole.replace(/_/g, ' ')}
                </div>
              </div>
            )}
            {contact.sentiment && (
              <div className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Sentiment</div>
                <div className="text-xs text-[var(--color-text-primary)]">{contact.sentiment}</div>
              </div>
            )}
            {contact.influenceLevel && (
              <div className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Influence</div>
                <div className="text-xs text-[var(--color-text-primary)]">{contact.influenceLevel}</div>
              </div>
            )}
            {contact.engagementStatus && (
              <div className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Engagement</div>
                <div className="text-xs text-[var(--color-text-primary)]">
                  {contact.engagementStatus.replace(/_/g, ' ')}
                </div>
              </div>
            )}
          </div>

          {/* Contact info */}
          {(contact.email || contact.phone) && (
            <div className="space-y-1">
              {contact.email && (
                <div className="text-xs text-[var(--color-text-secondary)]">{contact.email}</div>
              )}
              {contact.phone && (
                <div className="text-xs text-[var(--color-text-secondary)]">{contact.phone}</div>
              )}
            </div>
          )}

          {/* Background */}
          {contact.background && (
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">Background</div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{contact.background}</p>
            </div>
          )}

          {/* Engagement note */}
          {contact.engagementStatusNote && (
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">Engagement Note</div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{contact.engagementStatusNote}</p>
            </div>
          )}

          {/* Relationship Intel */}
          {contact.relationshipIntels.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">Relationship Intel</div>
              <div className="space-y-1.5">
                {contact.relationshipIntels.map((ri) => (
                  <div key={ri.id} className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-accent)] uppercase">{ri.category}</span>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{ri.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desires */}
          {contact.desires.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">Desires</div>
              <div className="space-y-1.5">
                {contact.desires.map((d) => (
                  <div key={d.id} className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-accent)] uppercase">{d.category}</span>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{d.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-sm text-[var(--color-text-muted)]">Contact not found</div>
      )}
    </div>
  );
}
