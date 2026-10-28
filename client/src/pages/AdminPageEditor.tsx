import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getPage, savePage, uploadImage } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import VisualFieldEditor from '../components/admin/VisualFieldEditor';
import ToastFeedback from '../components/ToastFeedback';
import { useStudyAbroad } from '../context/StudyAbroadContext';
import type { Page, Section } from '../types';

const sectionTemplates: Record<string, Record<string, any>> = {
  hero: {
    headline: 'Page headline',
    subheadline: 'Supporting headline',
    tagline: '',
    ctaText: 'Learn more',
    ctaLink: '/contact',
    backgroundImage: '',
  },
  introCards: {
    title: 'Section title',
    description: 'Section description',
    cards: [{ title: 'Card title', description: 'Card description' }],
  },
  about: {
    title: 'About Us',
    subtitle: '',
    image: '',
    paragraphs: ['Add your paragraph here.'],
    ctaText: 'Learn more',
    ctaLink: '/about',
  },
  universities: {
    title: 'Top Universities',
    subtitle: '',
    ctaText: 'View more',
    ctaLink: '/universities',
    items: [{ name: 'University name', country: 'Country', image: '' }],
  },
  stats: {
    title: 'Our Impact',
    items: [{ value: '100+', label: 'Achievement' }],
  },
  testimonials: {
    title: 'Testimonials',
    subtitle: '',
    items: [{ name: 'Student name', role: 'Student', rating: 5, message: '', image: '' }],
  },
  contact: {
    title: 'Get in Touch',
    address: '',
    phone: '',
    email: '',
    hours: '',
  },
  pageHero: {
    title: 'Page title',
    subtitle: '',
    backgroundImage: '',
  },
  richText: {
    content: 'Add your content here.',
  },
  features: {
    title: 'Features',
    items: [{ title: 'Feature title', description: 'Feature description' }],
  },
  universityList: {
    title: 'Top Universities',
    items: [{ name: 'University name', country: 'Country', image: '' }],
  },
};

function sectionName(type: string) {
  return type
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function countrySectionName(
  sectionType: string,
  countryName?: string
) {
  const country = countryName || 'this country';
  if (sectionType === 'pageHero') return 'Country hero';
  if (sectionType === 'richText') return `Why ${country} introduction`;
  if (sectionType === 'features') return `Why ${country} benefit cards`;
  return sectionName(sectionType);
}

function addTeamImageFields(page: Page): Page {
  if (page.slug !== 'team') return page;

  return {
    ...page,
    sections: page.sections.map((section) => {
      if (section.type !== 'features' || !Array.isArray(section.data?.items)) {
        return section;
      }

      return {
        ...section,
        data: {
          ...section.data,
          items: section.data.items.map((item: Record<string, any>) => ({
            image: '',
            ...item,
          })),
        },
      };
    }),
  };
}

export default function AdminPageEditor() {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const { refresh: refreshCountries } = useStudyAbroad();
  const studyAbroadEditor = pathname.startsWith('/admin/study-abroad/edit/');
  const [page, setPage] = useState<Page | null>(null);
  const [newSectionType, setNewSectionType] = useState('hero');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPage(id)
      .then((loadedPage) => {
        const preparedPage = studyAbroadEditor
          ? {
              ...loadedPage,
              category: 'study-abroad',
              countryName:
                loadedPage.countryName ||
                loadedPage.title.replace(/^Study in\s+/i, ''),
              countryAliases: loadedPage.countryAliases?.length
                ? loadedPage.countryAliases
                : [
                    loadedPage.countryName ||
                      loadedPage.title.replace(/^Study in\s+/i, ''),
                  ],
            }
          : loadedPage;
        setPage(addTeamImageFields(preparedPage));
      })
      .catch(() => {
        setMessageType('error');
        setMessage('This page could not be loaded.');
      });
  }, [id, studyAbroadEditor]);

  const changeSection = (index: number, nextSection: Section) => {
    if (!page) return;
    setPage({
      ...page,
      sections: page.sections.map((section, sectionIndex) =>
        sectionIndex === index ? nextSection : section
      ),
    });
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    if (!page) return;
    const target = index + direction;
    if (target < 0 || target >= page.sections.length) return;
    const sections = [...page.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setPage({ ...page, sections });
  };

  const removeSection = (index: number) => {
    if (!page) return;
    setPage({ ...page, sections: page.sections.filter((_, sectionIndex) => sectionIndex !== index) });
  };

  const addSection = () => {
    if (!page) return;
    setPage({
      ...page,
      sections: [
        ...page.sections,
        {
          type: newSectionType,
          data: structuredClone(sectionTemplates[newSectionType]),
        },
      ],
    });
  };

  const handleUpload = async (file: File) => {
    setMessage('');
    try {
      return await uploadImage(file);
    } catch {
      setMessageType('error');
      setMessage('Image upload failed. Please try again.');
      throw new Error('Upload failed');
    }
  };

  const handleSave = async () => {
    if (!page?._id) return;
    setSaving(true);
    setMessage('');
    try {
      const saved = await savePage(page._id, {
        title: page.title,
        slug: page.slug,
        metaDescription: page.metaDescription,
        category: page.category,
        countryName: page.countryName,
        countryAliases: page.countryAliases,
        order: page.order,
        isVisible: page.isVisible,
        sections: page.sections,
      });
      setPage(addTeamImageFields(saved));
      if (saved.category === 'study-abroad') {
        await refreshCountries();
      }
      setMessageType('success');
      setMessage('Page saved successfully.');
    } catch {
      setMessageType('error');
      setMessage('The page could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!page) {
    return (
      <AdminLayout title="Page editor" description="Loading page content...">
        <div className="border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          {message || 'Loading...'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Edit: ${page.title}`}
      description="Edit visible fields and sections. No code or JSON required."
      actions={
        <>
          <Link
            to={studyAbroadEditor ? '/admin/study-abroad' : '/admin/pages'}
            className="hidden border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:block"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save page'}
          </button>
        </>
      }
    >
      <ToastFeedback message={message} type={messageType} />

      <section className="border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-bold text-gray-900">Page details</h2>
          <p className="mt-1 text-sm text-gray-500">Control the page name, URL, description, and visibility.</p>
        </div>
        <div className="grid gap-5 p-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Page title</span>
            <input
              value={page.title}
              onChange={(event) => setPage({ ...page, title: event.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">URL slug</span>
            <div className="flex border border-gray-300 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
              <span className="border-r border-gray-200 bg-gray-50 px-3 py-2 text-gray-500">/</span>
              <input
                value={page.slug}
                onChange={(event) => setPage({ ...page, slug: event.target.value })}
                className="min-w-0 flex-1 px-3 py-2 outline-none"
              />
            </div>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Search description</span>
            <textarea
              value={page.metaDescription || ''}
              rows={3}
              onChange={(event) => setPage({ ...page, metaDescription: event.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </label>
          {page.category === 'study-abroad' && (
            <>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Country name
                </span>
                <input
                  value={page.countryName || ''}
                  onChange={(event) => setPage({ ...page, countryName: event.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Web Development"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Matching country names
                </span>
                <input
                  value={(page.countryAliases || []).join(', ')}
                  onChange={(event) =>
                    setPage({
                      ...page,
                      countryAliases: event.target.value
                        .split(',')
                        .map((alias) => alias.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Web, Website, Frontend"
                />
              </label>
            </>
          )}
          <label className="flex items-center justify-between border border-gray-200 px-4 py-3">
            <span>
              <span className="block text-sm font-semibold text-gray-700">Published</span>
              <span className="text-xs text-gray-500">Show this page on the website</span>
            </span>
            <input
              type="checkbox"
              checked={page.isVisible}
              onChange={(event) => setPage({ ...page, isVisible: event.target.checked })}
              className="h-5 w-5 accent-blue-600"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Display order</span>
            <input
              type="number"
              value={page.order}
              onChange={(event) => setPage({ ...page, order: Number(event.target.value) })}
              className="w-full border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </label>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Content sections</h2>
            <p className="mt-1 text-sm text-gray-500">
              {studyAbroadEditor
                ? 'Public page order: service hero, portfolio projects, then the service introduction and benefit cards.'
                : 'Expand a section to edit its content and images.'}
            </p>
          </div>
          <div className="flex">
            <select
              value={newSectionType}
              onChange={(event) => setNewSectionType(event.target.value)}
              className="border border-r-0 border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {Object.keys(sectionTemplates).map((type) => (
                <option key={type} value={type}>{sectionName(type)}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addSection}
              className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
            >
              Add section
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {page.sections.map((section, index) => {
            const syncedUniversitySection =
              page.slug === 'home' && section.type === 'universities';
            const editableData = syncedUniversitySection
              ? Object.fromEntries(
                  Object.entries(section.data).filter(([key]) => key !== 'items')
                )
              : section.data;

            return (
            <details key={section._id || `${section.type}-${index}`} open={index === 0} className="border border-gray-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4">
                <span className="flex h-8 w-8 items-center justify-center bg-blue-50 text-sm font-bold text-blue-700">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900">
                    {studyAbroadEditor
                      ? countrySectionName(section.type, page.countryName)
                      : sectionName(section.type)}
                  </h3>
                  <p className="text-xs text-gray-500">Click to expand or collapse</p>
                </div>
                <div className="flex items-center gap-1" onClick={(event) => event.preventDefault()}>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                    className="border border-gray-300 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                    aria-label="Move section up"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    disabled={index === page.sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                    className="border border-gray-300 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                    aria-label="Move section down"
                  >
                    &darr;
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </summary>
              <div className="border-t border-gray-200 bg-gray-50 p-5">
                {syncedUniversitySection && (
                  <div className="mb-5 border-l-4 border-blue-600 bg-blue-50 p-4 text-sm text-blue-800">
                    University cards are synced automatically from Study Abroad.
                    Manage them from each country&apos;s Universities page.
                  </div>
                )}
                <VisualFieldEditor
                  label=""
                  value={editableData}
                  onChange={(data) =>
                    changeSection(index, {
                      ...section,
                      data: syncedUniversitySection
                        ? { ...section.data, ...data }
                        : data,
                    })
                  }
                  onUpload={handleUpload}
                />
              </div>
            </details>
            );
          })}
        </div>
      </section>

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-900 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save all changes'}
        </button>
      </div>
    </AdminLayout>
  );
}
