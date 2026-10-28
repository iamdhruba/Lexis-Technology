import { Link } from 'react-router-dom';
import { useStudyAbroad, fallbackServices } from '../context/StudyAbroadContext';

export default function StudyAbroadPage() {
  const { countries, loading } = useStudyAbroad();
  const activeServices = countries && countries.length > 0 ? countries : fallbackServices;

  return (
    <section className="bg-white py-16">
      <div className="container-brand">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Lexis Technology
          </p>
          <h1 className="mt-3 text-4xl font-bold text-blue-900">
            Our Core Digital Services
          </h1>
          <p className="mt-4 text-gray-600">
            Explore our specialized capabilities in web engineering, cinematic video editing, and creative design.
          </p>
        </div>

        {loading && activeServices.length === 0 ? (
          <p className="py-14 text-center text-gray-500">
            Loading services...
          </p>
        ) : (
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((service) => (
              <Link
                key={service.slug}
                to={service.to}
                className="group flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:border-blue-600 hover:shadow-lg"
              >
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.countryName}
                    loading="lazy"
                    decoding="async"
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-blue-50 px-6 text-center text-sm font-semibold text-blue-800">
                    Service preview
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Specialized Service
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-blue-900">
                    {service.countryName}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>
                  {service.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-700">
                      {service.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 bg-blue-600"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-5 border-t border-gray-100 pt-4 text-sm font-bold text-blue-700 transition group-hover:text-blue-900">
                    Explore service &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
