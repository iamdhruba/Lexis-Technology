import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

type IconName =
  | 'dashboard'
  | 'pages'
  | 'study'
  | 'users'
  | 'settings'
  | 'site'
  | 'logout'
  | 'menu';

function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    pages: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h8" />
      </>
    ),
    study: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.55-1.03H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1.03H21v4h-.08A1.7 1.7 0 0 0 19.4 15z" />
      </>
    ),
    site: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

interface AdminLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminLayout({
  title,
  description,
  actions,
  children,
}: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('edujung_admin_sidebar_collapsed') === 'true',
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: 'dashboard' as IconName },
    { to: '/admin/pages', label: 'Pages', icon: 'pages' as IconName },
    { to: '/admin/study-abroad', label: 'Study Abroad', icon: 'study' as IconName },
    { to: '/admin/users', label: 'User Records', icon: 'users' as IconName },
    { to: '/admin/settings', label: 'Site Settings', icon: 'settings' as IconName },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setCollapsed((value) => {
      const nextValue = !value;
      localStorage.setItem('edujung_admin_sidebar_collapsed', String(nextValue));
      return nextValue;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <ToastContainer
        position="top-right"
        autoClose={700}
        newestOnTop
        closeOnClick
        hideProgressBar
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        limit={3}
      />
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#0a0f1d] text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-5">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src="/logo.png" alt="" className="h-11 w-11 shrink-0 object-contain" />
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
                <p className="truncate font-bold">EduJung</p>
                <p className="text-xs text-white/50">Content Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const active =
              item.to === '/admin'
                ? pathname === '/admin'
                : item.to === '/admin/pages'
                  ? pathname.startsWith('/admin/pages') || pathname.startsWith('/admin/edit/')
                  : pathname.startsWith(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5 shrink-0" />
                <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={toggleSidebar}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden w-full items-center gap-3 px-3 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-5 w-5 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {!collapsed && <span>Collapse sidebar</span>}
          </button>
          <Link
            to="/"
            title={collapsed ? 'View website' : undefined}
            className="flex items-center gap-3 px-3 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="site" className="h-5 w-5 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>View website</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Log out' : undefined}
            className="flex w-full items-center gap-3 px-3 py-3 text-sm text-white/70 transition hover:bg-red-600 hover:text-white"
          >
            <Icon name="logout" className="h-5 w-5 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>Log out</span>
          </button>
        </div>
      </aside>

      <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
          <div className="flex min-h-20 items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="border border-gray-300 p-2 text-gray-700 lg:hidden"
              aria-label="Open sidebar"
            >
              <Icon name="menu" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
