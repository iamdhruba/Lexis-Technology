import { useEffect, useState } from 'react';
import api, { uploadImage } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import VisualFieldEditor from '../components/admin/VisualFieldEditor';
import ToastFeedback from '../components/ToastFeedback';
import { useSettings } from '../context/SettingsContext';
import type { SiteSettings } from '../context/SettingsContext';

export default function AdminSettings() {
  const { refresh } = useSettings();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/settings')
      .then((response) => setSettings(response.data as SiteSettings))
      .catch(() => {
        setMessageType('error');
        setMessage('Site settings could not be loaded.');
      });
  }, []);

  const setField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    if (settings) setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const response = await api.put('/settings', settings);
      setSettings(response.data as SiteSettings);
      await refresh();
      setMessageType('success');
      setMessage('Site settings saved successfully.');
    } catch {
      setMessageType('error');
      setMessage('Site settings could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      return await uploadImage(file);
    } catch {
      setMessageType('error');
      setMessage('Image upload failed.');
      throw new Error('Upload failed');
    }
  };

  if (!settings) {
    return (
      <AdminLayout title="Site settings" description="Loading global website information...">
        <div className="border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          {message || 'Loading...'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Site settings"
      description="Update contact details, branding, social links, and footer navigation."
      actions={
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      }
    >
      <ToastFeedback message={message} type={messageType} />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-bold text-gray-900">General information</h2>
            <p className="mt-1 text-sm text-gray-500">Core details used throughout the website.</p>
          </div>
          <div className="space-y-5 p-5">
            {[
              ['siteName', 'Site name'],
              ['phone', 'Phone number'],
              ['email', 'Email address'],
              ['address', 'Office address'],
              ['hours', 'Opening hours'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>
                {key === 'address' || key === 'hours' ? (
                  <textarea
                    rows={3}
                    value={settings[key as keyof SiteSettings] as string}
                    onChange={(event) => setField(key as keyof SiteSettings, event.target.value as any)}
                    className="w-full border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                ) : (
                  <input
                    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                    value={settings[key as keyof SiteSettings] as string}
                    onChange={(event) => setField(key as keyof SiteSettings, event.target.value as any)}
                    placeholder={key === 'phone' ? '+977 98XXXXXXXX' : undefined}
                    className="w-full border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                )}
                {key === 'phone' && (
                  <span className="mt-1.5 block text-xs text-gray-500">
                    Use the international format. This number is used by the Schedule a Call button.
                  </span>
                )}
              </label>
            ))}
          </div>
        </section>

        <section className="border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-bold text-gray-900">Brand logo</h2>
            <p className="mt-1 text-sm text-gray-500">Paste an image URL or upload a new logo.</p>
          </div>
          <div className="p-5">
            <VisualFieldEditor
              label="logo"
              value={settings.logo}
              onChange={(logo) => setField('logo', logo)}
              onUpload={handleUpload}
            />
          </div>
        </section>
      </div>

      <section className="mt-6 border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-gray-900">Social links</h2>
            <p className="mt-1 text-sm text-gray-500">Links shown in the website footer.</p>
          </div>
          <button
            type="button"
            onClick={() => setField('socialLinks', [...settings.socialLinks, { platform: '', url: '' }])}
            className="border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            + Add social link
          </button>
        </div>
        <div className="space-y-3 p-5">
          {settings.socialLinks.length === 0 && (
            <p className="border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              No social links added.
            </p>
          )}
          {settings.socialLinks.map((social, index) => (
            <div key={index} className="grid gap-3 border border-gray-200 p-4 md:grid-cols-[1fr_2fr_auto]">
              <label>
                <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">Platform</span>
                <input
                  value={social.platform}
                  onChange={(event) =>
                    setField(
                      'socialLinks',
                      settings.socialLinks.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, platform: event.target.value } : item
                      )
                    )
                  }
                  className="w-full border border-gray-300 px-3 py-2"
                  placeholder="Facebook"
                />
              </label>
              <label>
                <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">URL</span>
                <input
                  value={social.url}
                  onChange={(event) =>
                    setField(
                      'socialLinks',
                      settings.socialLinks.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, url: event.target.value } : item
                      )
                    )
                  }
                  className="w-full border border-gray-300 px-3 py-2"
                  placeholder="https://..."
                />
              </label>
              <button
                type="button"
                onClick={() => setField('socialLinks', settings.socialLinks.filter((_, itemIndex) => itemIndex !== index))}
                className="self-end border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-gray-900">Footer columns</h2>
            <p className="mt-1 text-sm text-gray-500">Create navigation groups and manage their links.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setField('footerColumns', [
                ...settings.footerColumns,
                { title: 'New column', items: [] },
              ])
            }
            className="border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            + Add column
          </button>
        </div>
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {settings.footerColumns.length === 0 && (
            <p className="border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 lg:col-span-2">
              No footer columns added.
            </p>
          )}
          {settings.footerColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="border border-gray-200 p-4">
              <div className="mb-4 flex gap-2">
                <input
                  value={column.title}
                  onChange={(event) =>
                    setField(
                      'footerColumns',
                      settings.footerColumns.map((item, itemIndex) =>
                        itemIndex === columnIndex ? { ...item, title: event.target.value } : item
                      )
                    )
                  }
                  className="min-w-0 flex-1 border border-gray-300 px-3 py-2 font-semibold"
                  placeholder="Column title"
                />
                <button
                  type="button"
                  onClick={() =>
                    setField(
                      'footerColumns',
                      settings.footerColumns.filter((_, itemIndex) => itemIndex !== columnIndex)
                    )
                  }
                  className="border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                {column.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="grid gap-2 border border-gray-100 bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      value={item.label}
                      onChange={(event) =>
                        setField(
                          'footerColumns',
                          settings.footerColumns.map((currentColumn, currentColumnIndex) =>
                            currentColumnIndex === columnIndex
                              ? {
                                  ...currentColumn,
                                  items: currentColumn.items.map((currentItem, currentItemIndex) =>
                                    currentItemIndex === itemIndex
                                      ? { ...currentItem, label: event.target.value }
                                      : currentItem
                                  ),
                                }
                              : currentColumn
                          )
                        )
                      }
                      className="border border-gray-300 bg-white px-3 py-2 text-sm"
                      placeholder="Label"
                    />
                    <input
                      value={item.url || ''}
                      onChange={(event) =>
                        setField(
                          'footerColumns',
                          settings.footerColumns.map((currentColumn, currentColumnIndex) =>
                            currentColumnIndex === columnIndex
                              ? {
                                  ...currentColumn,
                                  items: currentColumn.items.map((currentItem, currentItemIndex) =>
                                    currentItemIndex === itemIndex
                                      ? { ...currentItem, url: event.target.value }
                                      : currentItem
                                  ),
                                }
                              : currentColumn
                          )
                        )
                      }
                      className="border border-gray-300 bg-white px-3 py-2 text-sm"
                      placeholder="/page"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setField(
                          'footerColumns',
                          settings.footerColumns.map((currentColumn, currentColumnIndex) =>
                            currentColumnIndex === columnIndex
                              ? {
                                  ...currentColumn,
                                  items: currentColumn.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex),
                                }
                              : currentColumn
                          )
                        )
                      }
                      className="px-2 text-sm font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setField(
                    'footerColumns',
                    settings.footerColumns.map((currentColumn, currentColumnIndex) =>
                      currentColumnIndex === columnIndex
                        ? { ...currentColumn, items: [...currentColumn.items, { label: '', url: '' }] }
                        : currentColumn
                    )
                  )
                }
                className="mt-3 border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                + Add link
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save all settings'}
        </button>
      </div>
    </AdminLayout>
  );
}
