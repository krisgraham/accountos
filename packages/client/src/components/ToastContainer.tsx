import { useUIStore } from '../stores/uiStore';
import { CloseIcon, CheckIcon, AlertTriangleIcon, InfoIcon } from '../icons';

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" data-testid="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          data-testid={`toast-${toast.type}`}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg text-sm min-w-[280px] ${
            toast.type === 'success'
              ? 'bg-green-950/90 border-green-800 text-green-200'
              : toast.type === 'error'
                ? 'bg-red-950/90 border-red-800 text-red-200'
                : 'bg-blue-950/90 border-blue-800 text-blue-200'
          }`}
        >
          {toast.type === 'success' && <CheckIcon size={16} />}
          {toast.type === 'error' && <AlertTriangleIcon size={16} />}
          {toast.type === 'info' && <InfoIcon size={16} />}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-0.5 rounded hover:bg-white/10"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
