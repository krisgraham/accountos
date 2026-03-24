import { NavLink } from 'react-router-dom';
import { useSidebarStore } from '../stores/sidebarStore';
import { useThemeStore } from '../stores/themeStore';
import { useUIStore } from '../stores/uiStore';
import {
  HomeIcon,
  BuildingIcon,
  UsersIcon,
  BriefcaseIcon,
  MessageSquareIcon,
  CalendarIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../icons';

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Dashboard' },
  { to: '/accounts', icon: BuildingIcon, label: 'Accounts' },
  { to: '/contacts', icon: UsersIcon, label: 'Contacts' },
  { to: '/projects', icon: BriefcaseIcon, label: 'Projects' },
  { to: '/communications', icon: MessageSquareIcon, label: 'Communications' },
  { to: '/meeting-notes', icon: CalendarIcon, label: 'Meeting Notes' },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();

  return (
    <aside
      data-testid="sidebar"
      className={`flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 ${
        collapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3 border-b border-[var(--color-border)]">
        {!collapsed && (
          <span className="text-base font-semibold text-[var(--color-text-primary)] truncate">
            AccountOS
          </span>
        )}
        <button
          onClick={toggle}
          className="ml-auto p-1.5 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
        </button>
      </div>

      {/* Search trigger */}
      <div className="px-2 py-2">
        <button
          onClick={() => useUIStore.getState().openSearch()}
          className={`flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <SearchIcon size={16} />
          {!collapsed && (
            <>
              <span>Search</span>
              <kbd className="ml-auto text-xs bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded px-1">
                Cmd+K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-2 py-3 border-t border-[var(--color-border)]">
        <button
          data-testid="theme-toggle"
          onClick={toggleTheme}
          className={`flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isDark ? (
              <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>
            ) : (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            )}
          </svg>
          {!collapsed && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
        </button>
      </div>
    </aside>
  );
}
