import { useState } from 'react';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  placeholder?: string;
  minLength?: number;
  helperText?: string;
}

export default function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  minLength,
  helperText,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <div className="flex border border-gray-300 bg-white focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={minLength}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 outline-none"
          required
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="border-l border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {helperText && (
        <span className="mt-1 block text-xs text-gray-500">{helperText}</span>
      )}
    </label>
  );
}
