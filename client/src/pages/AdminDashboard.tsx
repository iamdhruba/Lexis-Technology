import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPages } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import type { Page } from '../types';

export default function AdminDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPages()
      .then((loadedPages) => {
        setPages(loadedPages);
        setError(false);
      })
      .catch(() => {
        setPages([]);
        setError(true);
      });
  }, []);

  const visiblePages = pages.filter((page) => page.isVisible).length;
  const sectionCount = pages.reduce((total, page) => total + page.sections.length, 0);

  return (
    <AdminLayout
      title="Dashboard"
      description="A clear overview of your website administration."
    >
      {error && (
        <div className="mb-6 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-700">
          Something went wrong. Dashboard data could not be loaded.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Total pages</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {error ? '—' : pages.length}
          </p>
        </div>
        <div className="border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Published pages</p>
          <p className="mt-2 text-3xl font-bold text-blue-700">
            {error ? '—' : visiblePages}
          </p>
        </div>
        <div className="border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Content sections</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {error ? '—' : sectionCount}
          </p>
        </div>
      </div>

      <section className="mt-6 border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">Administration</h2>
          <p className="mt-1 text-sm text-gray-500">Choose exactly what you want to manage.</p>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <Link
            to="/admin/pages"
            className="group border border-gray-200 bg-white p-6 transition hover:border-blue-600 hover:bg-blue-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Content</p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">Website Pages</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Edit page text, images, sections, visibility, and display order.
                </p>
              </div>
              <span className="text-2xl text-blue-700" aria-hidden="true">&rarr;</span>
            </div>
            <p className="mt-6 text-sm font-semibold text-blue-700">
              {error ? 'Pages unavailable' : `Manage ${pages.length} pages`}
            </p>
          </Link>

          <Link
            to="/admin/study-abroad"
            className="group border border-gray-200 bg-white p-6 transition hover:border-blue-600 hover:bg-blue-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Destinations</p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">Study Abroad</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Add countries, edit destination pages, and manage universities.
                </p>
              </div>
              <span className="text-2xl text-blue-700" aria-hidden="true">&rarr;</span>
            </div>
            <p className="mt-6 text-sm font-semibold text-blue-700">
              Manage countries and universities
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="group border border-gray-200 bg-white p-6 transition hover:border-blue-600 hover:bg-blue-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Access
                </p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  User Records
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Review registered users and update account roles securely.
                </p>
              </div>
              <span className="text-2xl text-blue-700" aria-hidden="true">
                &rarr;
              </span>
            </div>
            <p className="mt-6 text-sm font-semibold text-blue-700">
              Manage user access
            </p>
          </Link>

          <Link
            to="/admin/settings"
            className="group border border-gray-200 bg-white p-6 transition hover:border-blue-600 hover:bg-blue-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Global</p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">Site Settings</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Manage branding, contact information, social links, and footer navigation.
                </p>
              </div>
              <span className="text-2xl text-blue-700" aria-hidden="true">&rarr;</span>
            </div>
            <p className="mt-6 text-sm font-semibold text-blue-700">Open site settings</p>
          </Link>
        </div>
      </section>
    </AdminLayout>
  );
}
