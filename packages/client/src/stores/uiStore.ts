import { create } from 'zustand';

interface UIStore {
  searchOpen: boolean;
  quickAddContactOpen: boolean;
  logCommunicationOpen: boolean;
  newMeetingNoteOpen: boolean;
  newProjectOpen: boolean;
  toasts: Toast[];
  openSearch: () => void;
  closeSearch: () => void;
  openQuickAddContact: () => void;
  closeQuickAddContact: () => void;
  openLogCommunication: () => void;
  closeLogCommunication: () => void;
  openNewMeetingNote: () => void;
  closeNewMeetingNote: () => void;
  openNewProject: () => void;
  closeNewProject: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastId = 0;

export const useUIStore = create<UIStore>()((set) => ({
  searchOpen: false,
  quickAddContactOpen: false,
  logCommunicationOpen: false,
  newMeetingNoteOpen: false,
  newProjectOpen: false,
  toasts: [],
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openQuickAddContact: () => set({ quickAddContactOpen: true }),
  closeQuickAddContact: () => set({ quickAddContactOpen: false }),
  openLogCommunication: () => set({ logCommunicationOpen: true }),
  closeLogCommunication: () => set({ logCommunicationOpen: false }),
  openNewMeetingNote: () => set({ newMeetingNoteOpen: true }),
  closeNewMeetingNote: () => set({ newMeetingNoteOpen: false }),
  openNewProject: () => set({ newProjectOpen: true }),
  closeNewProject: () => set({ newProjectOpen: false }),
  addToast: (toast) => {
    const id = String(++toastId);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
