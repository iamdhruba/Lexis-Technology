import { useState } from 'react';

type Value = any;

interface VisualFieldEditorProps {
  label: string;
  value: Value;
  onChange: (value: Value) => void;
  onUpload?: (file: File) => Promise<string>;
  depth?: number;
}

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function blankFrom(sample: Value): Value {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === 'object') {
    return Object.fromEntries(
      Object.entries(sample).map(([key, value]) => [key, blankFrom(value)])
    );
  }
  if (typeof sample === 'boolean') return false;
  if (typeof sample === 'number') return 0;
  return '';
}

function ImageEditor({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload?: (file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file?: File) => {
    if (!file || !onUpload) return;
    setUploading(true);
    try {
      onChange(await onUpload(file));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{humanize(label)}</label>
      {value && (
        <div className="mb-3 flex h-48 w-full items-center justify-center border border-gray-200 bg-white p-3">
          <img
            src={value}
            alt=""
            className="h-full w-full object-contain object-center"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Image URL"
          className="min-w-0 flex-1 border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        {onUpload && (
          <label className="cursor-pointer border border-gray-300 bg-gray-50 px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100">
            {uploading ? 'Uploading...' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(event) => upload(event.target.files?.[0])}
            />
          </label>
        )}
      </div>
    </div>
  );
}

export default function VisualFieldEditor({
  label,
  value,
  onChange,
  onUpload,
  depth = 0,
}: VisualFieldEditorProps) {
  const imageField = /image|logo|photo|icon/i.test(label);

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center justify-between gap-4 border border-gray-200 bg-white px-4 py-3">
        <span className="text-sm font-semibold text-gray-700">{humanize(label)}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="h-5 w-5 accent-blue-600"
        />
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-gray-700">{humanize(label)}</span>
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </label>
    );
  }

  if (typeof value === 'string' || value == null) {
    const stringValue = value || '';
    if (imageField) {
      return (
        <ImageEditor
          label={label}
          value={stringValue}
          onChange={onChange}
          onUpload={onUpload}
        />
      );
    }

    const longField =
      stringValue.length > 100 ||
      /description|content|message|paragraph|tagline|address|hours/i.test(label);
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-gray-700">{humanize(label)}</span>
        {longField ? (
          <textarea
            value={stringValue}
            rows={4}
            onChange={(event) => onChange(event.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        ) : (
          <input
            value={stringValue}
            onChange={(event) => onChange(event.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        )}
      </label>
    );
  }

  if (Array.isArray(value)) {
    const sample = value[0];
    return (
      <div className="border border-gray-200 bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="font-semibold text-gray-800">{humanize(label)}</h4>
          <button
            type="button"
            onClick={() => onChange([...value, blankFrom(sample)])}
            className="border border-blue-600 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
          >
            + Add item
          </button>
        </div>
        {value.length === 0 ? (
          <p className="border border-dashed border-gray-300 bg-white p-4 text-center text-sm text-gray-500">
            No items yet. Add one to begin.
          </p>
        ) : (
          <div className="space-y-3">
            {value.map((item, index) => (
              <div key={index} className="border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Item {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                    className="text-xs font-semibold text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <VisualFieldEditor
                  label={typeof item === 'object' ? '' : `${label} ${index + 1}`}
                  value={item}
                  onChange={(nextValue) =>
                    onChange(value.map((current, itemIndex) => (itemIndex === index ? nextValue : current)))
                  }
                  onUpload={onUpload}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className={depth > 0 ? 'space-y-4' : 'grid gap-5 md:grid-cols-2'}>
        {label && depth > 0 && (
          <h4 className="border-b border-gray-200 pb-2 font-semibold text-gray-800">
            {humanize(label)}
          </h4>
        )}
        {Object.entries(value).map(([key, childValue]) => {
          const wide =
            Array.isArray(childValue) ||
            (childValue && typeof childValue === 'object') ||
            /description|content|message|paragraph|image|address|hours/i.test(key);
          return (
            <div key={key} className={depth === 0 && wide ? 'md:col-span-2' : ''}>
              <VisualFieldEditor
                label={key}
                value={childValue}
                onChange={(nextValue) => onChange({ ...value, [key]: nextValue })}
                onUpload={onUpload}
                depth={depth + 1}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
