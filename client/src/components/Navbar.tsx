import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings, defaultSiteSettings } from '../context/SettingsContext';
import { useStudyAbroad, fallbackServices } from '../context/StudyAbroadContext';
import { prefetchPage } from '../api';
import BrandName from './BrandName';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const { countries: countryLinks } = useStudyAbroad();

  const activeSettings = settings || defaultSiteSettings;
  const activeServiceLinks =
    countryLinks && countryLinks.length > 0 ? countryLinks : fallbackServices;

  const servicePageActive =
    pathname === '/services' ||
    pathname === '/study-abroad' ||
    activeServiceLinks.some((link) => pathname === link.to);

  const prefetchRoute = (to: string) => {
    const slug = to.replace(/^\//, '');
    if (!slug || slug === 'services' || slug === 'login') return;
    prefetchPage(slug);
    if (
      slug === 'home' ||
      activeServiceLinks.some((service) => service.slug === slug)
    ) {
      prefetchPage('universities');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="container-brand flex h-20 items-center justify-between">
        <Link
          to="/home"
          onPointerEnter={() => prefetchRoute('/home')}
          onFocus={() => prefetchRoute('/home')}
          className="flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <BrandLogo
            src={activeSettings.logo}
            alt={activeSettings.siteName || 'Lexis Technology'}
            badgeSize="md"
            className="h-10 w-auto max-w-[180px] object-contain"
          />
          <BrandName
            name={activeSettings.siteName || 'Lexis Technology'}
            className="hidden text-xl font-bold tracking-tight text-blue-900 xl:block"
          />
        </Link>

        <nav className="hidden items-center gap-3 lg:flex xl:gap-5">
          <Link
            to="/home"
            onPointerEnter={() => prefetchRoute('/home')}
            onFocus={() => prefetchRoute('/home')}
            className={`text-sm font-semibold uppercase tracking-wide transition hover:text-blue-600 ${
              pathname === '/home' || pathname === '/' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            HOME
          </Link>

          <Link
            to="/about"
            onPointerEnter={() => prefetchRoute('/about')}
            onFocus={() => prefetchRoute('/about')}
            className={`text-sm font-semibold uppercase tracking-wide transition hover:text-blue-600 ${
              pathname === '/about' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            ABOUT
          </Link>

          {/* Services Dropdown */}
          <div className="group relative">
            <Link
              to="/services"
              className={`flex items-center gap-1 text-sm font-semibold uppercase tracking-wide transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                servicePageActive ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              SERVICES
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <div className="invisible absolute right-0 top-full z-50 mt-3 w-64 border border-gray-200 bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                to="/services"
                className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 border-b border-gray-100"
              >
                All Services Overview &rarr;
              </Link>
              {activeServiceLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onPointerEnter={() => prefetchRoute(link.to)}
                  onFocus={() => prefetchRoute(link.to)}
                  className={`block px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700 ${
                    pathname === link.to
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/universities"
            onPointerEnter={() => prefetchRoute('/universities')}
            onFocus={() => prefetchRoute('/universities')}
            className={`text-sm font-semibold uppercase tracking-wide transition hover:text-blue-600 ${
              pathname === '/universities' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            PORTFOLIO
          </Link>

          <Link
            to="/team"
            onPointerEnter={() => prefetchRoute('/team')}
            onFocus={() => prefetchRoute('/team')}
            className={`text-sm font-semibold uppercase tracking-wide transition hover:text-blue-600 ${
              pathname === '/team' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            TEAM
          </Link>

          <Link
            to="/contact"
            onPointerEnter={() => prefetchRoute('/contact')}
            onFocus={() => prefetchRoute('/contact')}
            className={`text-sm font-semibold uppercase tracking-wide transition hover:text-blue-600 ${
              pathname === '/contact' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            CONTACT US
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/contact"
            className="bg-blue-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Get a Quote
          </Link>
          {isAuthenticated && !isAdmin ? (
            <button
              type="button"
              onClick={logout}
              className="border-2 border-blue-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-blue-700 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to={isAdmin ? '/admin' : '/login'}
              className="border-2 border-blue-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-blue-700 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {isAdmin ? 'Dashboard' : 'Login'}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="border border-gray-200 p-2 text-blue-900 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
          >
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">
          <div className="container-brand py-4">
            <Link
              to="/home"
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 text-sm font-semibold uppercase ${
                pathname === '/home' || pathname === '/'
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              HOME
            </Link>
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 text-sm font-semibold uppercase ${
                pathname === '/about'
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              ABOUT
            </Link>

            <div className="mt-2 border border-gray-200">
              <Link
                to="/services"
                onClick={() => setOpen(false)}
                className={`block border-b border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                  pathname === '/services'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-50 text-blue-800'
                }`}
              >
                OUR SERVICES
              </Link>
              {activeServiceLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-semibold ${
                    pathname === link.to
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              to="/universities"
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 text-sm font-semibold uppercase ${
                pathname === '/universities'
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              PORTFOLIO
            </Link>

            <Link
              to="/team"
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 text-sm font-semibold uppercase ${
                pathname === '/team'
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              TEAM
            </Link>

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 text-sm font-semibold uppercase ${
                pathname === '/contact'
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              CONTACT US
            </Link>

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 block w-full bg-blue-600 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-700"
            >
              Get a Free Quote
            </Link>

            {isAuthenticated && !isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="mt-3 block w-full border-2 border-blue-600 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-blue-700 transition hover:bg-blue-600 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                to={isAdmin ? '/admin' : '/login'}
                onClick={() => setOpen(false)}
                className="mt-3 block border-2 border-blue-600 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-blue-700 transition hover:bg-blue-600 hover:text-white"
              >
                {isAdmin ? 'Dashboard' : 'Login'}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
