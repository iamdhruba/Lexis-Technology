import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPage, savePage, uploadImage } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import VisualFieldEditor from '../components/admin/VisualFieldEditor';
import ToastFeedback from '../components/ToastFeedback';
import type { Page } from '../types';

export default function AdminCountryUniversities() {
  const { slug } = useParams<{ slug: string }>();
  const [countryPage, setCountryPage] = useState<Page | null>(null);
  const [universitiesPage, setUniversitiesPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([getPage(slug), getPage('universities')])
      .then(([country, universities]) => {
        setCountryPage(country);
        setUniversitiesPage(universities);
      })
      .catch(() => {
        setMessageType('error');
        setMessage('Service projects could not be loaded.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const countryName =
    countryPage?.countryName ||
    countryPage?.title.replace(/^Study in\s+/i, '') ||
    '';
  const aliases = useMemo(
    () =>
      (countryPage?.countryAliases?.length
        ? countryPage.countryAliases
        : [countryName]
      )
        .map((alias) => alias.trim().toLowerCase())
        .filter(Boolean),
    [countryName, countryPage?.countryAliases]
  );
  const universitySectionIndex =
    universitiesPage?.sections.findIndex(
      (section) =>
        section.type === 'universityList' || section.type === 'universities'
    ) ?? -1;
  const allUniversities: Record<string, any>[] =
    universitySectionIndex >= 0
      ? universitiesPage?.sections[universitySectionIndex].data.items || []
      : [];
  const countryUniversities = allUniversities
    .map((university, index) => ({ university, index }))
    .filter(({ university }) =>
      aliases.includes(String(university.country || '').trim().toLowerCase())
    );

  const updateAllUniversities = (items: Record<string, any>[]) => {
    if (!universitiesPage || universitySectionIndex < 0) return;
    setUniversitiesPage({
      ...universitiesPage,
      sections: universitiesPage.sections.map((section, index) =>
        index === universitySectionIndex
          ? { ...section, data: { ...section.data, items } }
          : section
      ),
    });
  };

  const updateUniversity = (
    index: number,
    changes: Record<string, any>
  ) => {
    updateAllUniversities(
      allUniversities.map((university, itemIndex) =>
        itemIndex === index ? { ...university, ...changes } : university
      )
    );
  };

  const addUniversity = () => {
    updateAllUniversities([
      {
        name: '',
        country: countryName,
        image: '',
        description: '',
        website: '',
      },
      ...allUniversities,
    ]);
  };

  const removeUniversity = (index: number) => {
    updateAllUniversities(
      allUniversities.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const save = async () => {
    if (!universitiesPage?._id) return;
    setSaving(true);
    setMessage('');
    try {
      const saved = await savePage(universitiesPage._id, {
        sections: universitiesPage.sections,
      });
      setUniversitiesPage(saved);
      setMessageType('success');
      setMessage(`${countryName} projects saved successfully.`);
    } catch {
      setMessageType('error');
      setMessage('Projects could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      return await uploadImage(file);
    } catch {
      setMessageType('error');
      setMessage('Image upload failed. Please try again.');
      throw new Error('Upload failed');
    }
  };

  return (
    <AdminLayout
      title={countryName ? `${countryName} Universities` : 'Universities'}
      description="Universities added here appear only on this country’s public study-abroad page."
      actions={
        <>
          <Link
            to="/admin/study-abroad"
            className="hidden border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:block"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className="bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Projects'}
          </button>
        </>
      }
    >
      <ToastFeedback message={message} type={messageType} />

      <section className="border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-gray-900">
              Projects for {countryName}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add the university name, description, website, and image.
            </p>
          </div>
          <button
            type="button"
            onClick={addUniversity}
            disabled={loading || !universitiesPage}
            className="border border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
          >
            + Add Project
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading projects...
          </div>
        ) : countryUniversities.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No universities added for {countryName}. Use “Add university” to begin.
          </div>
        ) : (
          <div className="space-y-4 p-5">
            {countryUniversities.map(({ university, index }) => (
              <article
                key={index}
                className="border border-gray-200 bg-gray-50 p-5"
              >
                <div className="grid gap-5 lg:grid-cols-2">
                  <label>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                      University name
                    </span>
                    <input
                      value={university.name || ''}
                      onChange={(event) =>
                        updateUniversity(index, { name: event.target.value })
                      }
                      className="w-full border border-gray-300 bg-white px-3 py-2"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Country
                    </span>
                    <input
                      value={countryName}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Description
                    </span>
                    <textarea
                      value={university.description || ''}
                      rows={4}
                      onChange={(event) =>
                        updateUniversity(index, {
                          description: event.target.value,
                        })
                      }
                      className="w-full border border-gray-300 bg-white px-3 py-2"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Website
                    </span>
                    <input
                      type="url"
                      value={university.website || ''}
                      onChange={(event) =>
                        updateUniversity(index, { website: event.target.value })
                      }
                      className="w-full border border-gray-300 bg-white px-3 py-2"
                      placeholder="https://..."
                    />
                  </label>
                  <div className="lg:col-span-2">
                    <VisualFieldEditor
                      label="image"
                      value={university.image || ''}
                      onChange={(image) => updateUniversity(index, { image })}
                      onUpload={handleUpload}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeUniversity(index)}
                    className="border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove university
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
