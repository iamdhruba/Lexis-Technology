import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-blue-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <Link to="/home" className="btn-primary mt-6">
        Go Home
      </Link>
    </div>
  );
}
