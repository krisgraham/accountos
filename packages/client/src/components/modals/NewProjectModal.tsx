import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { CloseIcon } from '../../icons';

interface Organization {
  id: string;
  name: string;
}

const PROJECT_TYPES = ['PRESALES', 'ACTIVE', 'ONGOING', 'STRATEGIC'];
const CONTRACT_STATUSES = ['PROPOSED', 'VERBAL_COMMIT', 'CONTRACTED', 'INVOICING'];

export function NewProjectModal() {
  const { newProjectOpen, closeNewProject, addToast } = useUIStore();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [name, setName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [type, setType] = useState('PRESALES');
  const [contractStatus, setContractStatus] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (newProjectOpen) {
      fetch('/api/organizations')
        .then((r) => r.json())
        .then((res) => {
          const orgList = res.data || [];
          setOrgs(orgList);
          if (orgList.length > 0 && !organizationId) setOrganizationId(orgList[0].id);
        });
    }
  }, [newProjectOpen]);

  if (!newProjectOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !organizationId) return;
    setSaving(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          organizationId,
          type,
          contractStatus: contractStatus || undefined,
          estimatedValue: estimatedValue ? parseFloat(estimatedValue) : undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      addToast({ type: 'success', message: `Project "${name}" created` });
      setName('');
      setContractStatus('');
      setEstimatedValue('');
      closeNewProject();
    } catch {
      addToast({ type: 'error', message: 'Failed to create project' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeNewProject}>
      <div className="w-full max-w-md bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">New Project</h2>
          <button onClick={closeNewProject} className="p-1 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
            <CloseIcon size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Name *</label>
            <input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Organization *</label>
            <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]">
              {orgs.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Type</label>
            <div className="flex gap-1.5">
              {PROJECT_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${type === t ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Contract Status</label>
            <select value={contractStatus} onChange={(e) => setContractStatus(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]">
              <option value="">Select...</option>
              {CONTRACT_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-1">Estimated Value ($)</label>
            <input type="number" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeNewProject} className="px-3 py-1.5 rounded-md text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]">Cancel</button>
            <button type="submit" disabled={!name.trim() || !organizationId || saving}
              className="px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
