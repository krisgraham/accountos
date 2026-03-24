import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';

export function useKeyboardShortcuts() {
  const {
    openSearch,
    closeSearch,
    searchOpen,
    openQuickAddContact,
    openLogCommunication,
    openNewMeetingNote,
    openNewProject,
  } = useUIStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Escape closes any open modal/overlay
      if (e.key === 'Escape') {
        if (searchOpen) {
          closeSearch();
          e.preventDefault();
        }
        return;
      }

      // Don't fire shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow Cmd+K even in inputs
        if (!((e.metaKey || e.ctrlKey) && e.key === 'k')) return;
      }

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            openSearch();
            break;
          case 'n':
            e.preventDefault();
            openQuickAddContact();
            break;
          case 'l':
            e.preventDefault();
            openLogCommunication();
            break;
          case 'm':
            e.preventDefault();
            openNewMeetingNote();
            break;
          case 'p':
            e.preventDefault();
            openNewProject();
            break;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    searchOpen,
    openSearch,
    closeSearch,
    openQuickAddContact,
    openLogCommunication,
    openNewMeetingNote,
    openNewProject,
  ]);
}
