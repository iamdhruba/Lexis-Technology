import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPage, deletePage, getPages } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import ToastFeedback from '../components/ToastFeedback';
import { isStudyAbroadPage } from '../constants/navigation';
import { useStudyAbroad } from '../context/StudyAbroadContext';
import type { Page } from '../types';

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminStudyAbroad() {
  const { refresh: refreshCountryNavigation } = useStudyAbroad();
  const [pages, setPages] = useState<Page[]>([]);
  const [countryName, setCountryName] = useState('');
  const [countrySlug, setCountrySlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [addCountryOpen, setAddCountryOpen] = useState(false);
  const [savingCountry, setSavingCountry] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<Page | null>(null);
  const [deletingCountry, setDeletingCountry] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const load = async () => {
    setLoading(true);
    try {
      const allPages = await getPages();
      setPages(allPages);
    } catch {
      setMessageType('error');
      setPages([]);
      setMessage('Something went wrong. Study destinations could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const countries = useMemo(
    () =>
      pages
        .filter(isStudyAbroadPage)
        .sort((a, b) =>
          (a.countryName || a.title).localeCompare(b.countryName || b.title)
        ),
    [pages]
  );

  const addCountry = async (event: FormEvent) => {
    event.preventDefault();
    const name = countryName.trim();
    const slug = makeSlug(countrySlug || countryName);

    if (!name || !slug) {
      setMessageType('error');
      setMessage('Country name and URL slug are required.');
      return;
    }

    setSavingCountry(true);
    setMessage('');
    try {
      await createPage({
        slug,
        title: `Study in ${name}`,
        category: 'study-abroad',
        countryName: name,
        countryAliases: [name],
        order: countries.length + 10,
        isVisible: true,
        metaDescription: `Study abroad opportunities, universities, and guidance for ${name}.`,
        sections: [
          {
            type: 'pageHero',
            data: {
              title: `Study in ${name}`,
              subtitle: 'Explore Your Options',
              backgroundImage: '',
            },
          },
          {
            type: 'richText',
            data: {
              content: `<p>Add information about studying in ${name}.</p>`,
            },
          },
          {
            type: 'features',
            data: {
              title: `Why ${name}?`,
              items: [
                {
                  title: 'Study opportunity',
                  description: 'Add details about this study destination.',
                },
              ],
            },
          },
        ],
      });
      setCountryName('');
      setCountrySlug('');
      setAddCountryOpen(false);
      await load();
      await refreshCountryNavigation();
      setMessageType('success');
      setMessage(`${name} was added. You can now edit its page.`);
    } catch (error: any) {
      setMessageType('error');
      setMessage(
        error.response?.data?.error || 'The country could not be added.'
      );
    } finally {
      setSavingCountry(false);
    }
  };

  const removeCountry = async () => {
    const country = countryToDelete;
    if (!country?._id) return;
    const name =
      country.countryName || country.title.replace(/^Study in\s+/i, '');

    setDeletingCountry(country.slug);
    setMessage('');
    try {
      await deletePage(country._id);
      await load();
      await refreshCountryNavigation();
      setMessageType('success');
      setMessage(`${name} was deleted.`);
    } catch {
      setMessageType('error');
      setMessage(`${name} could not be deleted.`);
    } finally {
      setDeletingCountry('');
      setCountryToDelete(null);
    }
  };

  return (
    <AdminLayout
      title="Study Abroad"
      description="Manage destination pages and the universities shown for each country."
    >
      <ToastFeedback message={message} type={messageType} />

      <section className="border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Countries</h2>
            <p className="mt-1 text-sm text-gray-500">
              Each country has its own public page and university results.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMessage('');
              setAddCountryOpen(true);
            }}
            className="shrink-0 border border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            + Add country
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading countries...
          </div>
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {countries.map((country) => (
              <article
                key={country._id || country.slug}
                className="border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {country.countryName ||
                        country.title.replace(/^Study in\s+/i, '')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">/{country.slug}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold ${
                      country.isVisible
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {country.isVisible ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link
                    to={`/admin/study-abroad/edit/${country.slug}`}
                    className="border border-blue-600 px-3 py-2 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Update country
                  </Link>
                  <Link
                    to={`/admin/study-abroad/${country.slug}/universities`}
                    className="border border-blue-600 px-3 py-2 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Universities
                  </Link>
                  <a
                    href={`/${country.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View page
                  </a>
                  <button
                    type="button"
                    onClick={() => setCountryToDelete(country)}
                    disabled={deletingCountry === country.slug}
                    className="border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingCountry === country.slug
                      ? 'Deleting...'
                      : 'Delete country'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {addCountryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-country-title"
            className="w-full max-w-lg border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="add-country-title" className="text-lg font-bold text-gray-900">
                  Add country
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  A complete editable study-abroad page will be created.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddCountryOpen(false)}
                disabled={savingCountry}
                className="border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                aria-label="Close add country"
              >
                &times;
              </button>
            </div>

            <form onSubmit={addCountry} className="space-y-5 p-5">
              {message && messageType === 'error' && (
                <div className="border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-700">
                  {message}
                </div>
              )}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Country name
                </span>
                <input
                  value={countryName}
                  onChange={(event) => {
                    setCountryName(event.target.value);
                    setCountrySlug(makeSlug(event.target.value));
                  }}
                  className="w-full border border-gray-300 bg-white px-3 py-2"
                  placeholder="New Zealand"
                  autoFocus
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  URL slug
                </span>
                <div className="flex border border-gray-300 bg-white">
                  <span className="border-r border-gray-200 bg-gray-50 px-3 py-2 text-gray-500">
                    /
                  </span>
                  <input
                    value={countrySlug}
                    onChange={(event) =>
                      setCountrySlug(makeSlug(event.target.value))
                    }
                    className="min-w-0 flex-1 px-3 py-2 outline-none"
                    placeholder="new-zealand"
                    required
                  />
                </div>
              </label>
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setAddCountryOpen(false);
                    setCountryName('');
                    setCountrySlug('');
                  }}
                  disabled={savingCountry}
                  className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCountry}
                  className="bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
                >
                  {savingCountry ? 'Adding...' : 'Add country'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {countryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-country-title"
            aria-describedby="delete-country-description"
            className="w-full max-w-md border border-red-200 bg-white shadow-2xl"
          >
            <div className="border-b border-red-100 bg-red-50 px-5 py-4">
              <h2 id="delete-country-title" className="text-lg font-bold text-red-800">
                Delete country?
              </h2>
            </div>
            <div className="p-5">
              <p className="font-semibold text-gray-900">
                {countryToDelete.countryName ||
                  countryToDelete.title.replace(/^Study in\s+/i, '')}
              </p>
              <p
                id="delete-country-description"
                className="mt-2 text-sm leading-6 text-gray-600"
              >
                This permanently removes the country page and all universities
                assigned to it. This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setCountryToDelete(null)}
                  disabled={Boolean(deletingCountry)}
                  className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={removeCountry}
                  disabled={Boolean(deletingCountry)}
                  className="bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {deletingCountry ? 'Deleting...' : 'Delete country'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
