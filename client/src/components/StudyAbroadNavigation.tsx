import { Link, useLocation } from 'react-router-dom';
import { useStudyAbroad } from '../context/StudyAbroadContext';

export default function StudyAbroadNavigation() {
  const { pathname } = useLocation();
  const {
    countries: countryLinks,
    loading,
    error,
  } = useStudyAbroad();

  return (
    <nav className="border-y border-gray-200 bg-white py-8" aria-label="Study abroad destinations">
      <div className="container-brand">
        <h2 className="mb-5 text-center text-2xl font-bold text-blue-900">
          Choose Your Study Destination
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading destinations...</p>
        ) : error ? (
          <p className="text-center text-gray-600">
            Something went wrong. Destinations could not be loaded.
          </p>
        ) : countryLinks.length === 0 ? (
          <p className="text-center text-gray-600">
            No study destinations are available.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {countryLinks.map((country) => (
              <Link
                key={country.to}
                to={country.to}
                aria-current={pathname === country.to ? 'page' : undefined}
                className={`border px-4 py-3 text-center text-sm font-semibold transition ${
                  pathname === country.to
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-800'
                }`}
              >
                {country.countryName}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
