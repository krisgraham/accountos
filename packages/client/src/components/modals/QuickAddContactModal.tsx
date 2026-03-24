import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { CloseIcon } from '../../icons';

interface Organization {
  id: string;
  name: string;
}

export function QuickAddContactModal() {
  const { quickAddContactOpen, closeQuickAddContact, addToast } = useUIStore();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [stakeholderRole, setStakeholderRole] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (quickAddContactOpen) {
      fetch('/api/organizations')
        .then((r) => r.json())
        .then((res) => {
          const orgList = res.data || [];
          setOrgs(orgList);
          if (orgList.length > 0 && !organizationId) {
            setOrganizationId(orgList[0].id);
          }
        });
    }
  }, [quickAddContactOpen]);

  if (!quickAddContactOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !organizationId) return;

    setSaving(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim() || undefined,
          email: email.trim() || undefined,
          organizationId,
          stakeholderRole: stakeholderRole || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to create contact');
      addToast({ type: 'success', message: `Contact "${name}" created` });
      setName('');
      setTitle('');
      setEmail('');
      setStakeholderRole('');
      closeQuickAddContact();
    } catch {
      addToast({ type: 'error', message: 'Failed to create contact' });
    } finally {
      setSaving(false);
    }
  };

  const roles = [
    'CHAMPION', 'ECONOMIC_BUYER', 'DECISION_MAKER', 'TECHNICAL_EVALUATOR',
    'INFLUENCER', 'EXECUTIVE_SPONSOR', 'COACH', 'END_USER', 'BLOCKER', 'GATEKEEPER',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeQuickAddContact}
      data-testid="quick-add-contact-modal"
    >
      <div
        className="w-full max-w-md bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Quick Add Contact</h2>
          <button onClick={closeQuickAddContact} className="p-1 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
            <CloseIcon size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Name *</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              data-testid="contact-name-input"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Organization *</label>
            <select
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            >
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Role</label>
            <select
              value={stakeholderRole}
              onChange={(e) => setStakeholderRole(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            >
              <option value="">Select role...</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeQuickAddContact}
              className="px-3 py-1.5 rounded-md text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !organizationId || saving}
              className="px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
              data-testid="contact-save-button"
            >
              {saving ? 'Saving...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
