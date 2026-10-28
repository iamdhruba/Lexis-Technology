import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md border border-gray-200 bg-white p-7 shadow-lg sm:p-9">
        <div className="mb-7 text-center">
          <Link
            to="/"
            aria-label="Back to Lexis Technology home"
            className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-blue-900 transition hover:text-blue-700"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-blue-600 text-white font-extrabold text-xl shadow-md">
              L
            </span>
            <span>Lexis <span className="text-blue-600 font-bold">Technology</span></span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-blue-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
        {children}
        <Link
          to="/"
          className="mt-6 block w-full border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-800"
        >
          &larr; Back to website
        </Link>
      </div>
    </main>
  );
}
