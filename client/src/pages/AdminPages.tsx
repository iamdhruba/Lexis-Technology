import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPages } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import { isStudyAbroadPage } from '../constants/navigation';
import type { Page } from '../types';

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPages()
      .then(setPages)
      .catch(() =>
        setError('Something went wrong. Pages could not be loaded.')
      )
      .finally(() => setLoading(false));
  }, []);

  const regularPages = pages.filter((page) => !isStudyAbroadPage(page));

  return (
    <AdminLayout
      title="Pages"
      description="Select a website page and edit its content visually."
    >
      <section className="border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">All website pages</h2>
          <p className="mt-1 text-sm text-gray-500">
            Page content, visibility, images, and sections are managed here.
          </p>
        </div>

        {error && (
          <div className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && (loading ? (
          <div className="p-10 text-center text-sm text-gray-500">Loading pages...</div>
        ) : regularPages.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">No pages are available.</div>
        ) : (
          <>
            <div className="divide-y divide-gray-200 md:hidden">
              {regularPages.map((page) => (
                <article key={page._id || page.slug} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">/{page.slug}</p>
                      <p className="mt-1 text-xs text-gray-400">{page.sections.length} sections</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold ${page.isVisible ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {page.isVisible ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <Link
                    to={`/admin/edit/${page.slug}`}
                    className="mt-4 block border border-blue-600 px-4 py-2 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Edit page
                  </Link>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Page</th>
                    <th className="px-5 py-3 font-semibold">URL</th>
                    <th className="px-5 py-3 font-semibold">Sections</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {regularPages.map((page) => (
                    <tr key={page._id || page.slug} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-semibold text-gray-900">{page.title}</td>
                      <td className="px-5 py-4 text-gray-500">/{page.slug}</td>
                      <td className="px-5 py-4 text-gray-500">{page.sections.length}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold ${page.isVisible ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {page.isVisible ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/edit/${page.slug}`}
                          className="border border-blue-600 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Edit page
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))}
      </section>
    </AdminLayout>
  );
}
