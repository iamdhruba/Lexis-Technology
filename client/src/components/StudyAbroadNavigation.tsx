import { Link, useLocation } from 'react-router-dom';
import { useStudyAbroad, fallbackServices } from '../context/StudyAbroadContext';

export default function StudyAbroadNavigation() {
  const { pathname } = useLocation();
  const { countries: countryLinks } = useStudyAbroad();
  const activeServices = countryLinks && countryLinks.length > 0 ? countryLinks : fallbackServices;

  return (
    <nav className="border-y border-gray-200 bg-white py-8" aria-label="Services Navigation">
      <div className="container-brand">
        <h2 className="mb-5 text-center text-2xl font-bold text-blue-900">
          Explore Our Core Services
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {activeServices.map((service) => (
            <Link
              key={service.to}
              to={service.to}
              aria-current={pathname === service.to ? 'page' : undefined}
              className={`border px-4 py-3 text-center text-sm font-semibold transition ${
                pathname === service.to
                  ? 'border-blue-700 bg-blue-700 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              {service.countryName}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
