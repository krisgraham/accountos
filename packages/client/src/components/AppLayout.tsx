import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ToastContainer } from './ToastContainer';
import { SearchOverlay } from './SearchOverlay';
import { QuickAddContactModal } from './modals/QuickAddContactModal';
import { LogCommunicationModal } from './modals/LogCommunicationModal';
import { NewMeetingNoteModal } from './modals/NewMeetingNoteModal';
import { NewProjectModal } from './modals/NewProjectModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useEffect } from 'react';
import { useSidebarStore } from '../stores/sidebarStore';

export function AppLayout() {
  useKeyboardShortcuts();

  const { setCollapsed } = useSidebarStore();

  // Auto-collapse sidebar below 1024px
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setCollapsed(true);
    };
    handler(mql);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [setCollapsed]);

  return (
    <div className="flex h-full bg-[var(--color-surface)]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <ToastContainer />
      <SearchOverlay />
      <QuickAddContactModal />
      <LogCommunicationModal />
      <NewMeetingNoteModal />
      <NewProjectModal />
    </div>
  );
}
