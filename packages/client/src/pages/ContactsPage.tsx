import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { PlusIcon } from '../icons';
import { PeopleView } from '../components/shared/PeopleView';
import { useUIStore } from '../stores/uiStore';

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
  organization: { id: string; name: string };
}

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { openQuickAddContact } = useUIStore();

  useEffect(() => {
    fetch('/api/contacts?limit=100')
      .then((r) => r.json())
      .then((res) => setContacts(res.data || []))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Contacts"
        subtitle="Stakeholder intelligence across all accounts"
        actions={
          <button
            onClick={openQuickAddContact}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <PlusIcon size={16} />
            New Contact
          </button>
        }
      />
      <div className="flex-1 p-6">
        {loading ? (
          <div className="text-[var(--color-text-muted)] text-sm">Loading...</div>
        ) : (
          <PeopleView contacts={contacts} defaultView="list" showOrgFilter />
        )}
      </div>
    </div>
  );
}
