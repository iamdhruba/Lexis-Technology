import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UniversitiesSection({
  data,
}: {
  data: Record<string, any>;
}) {
  const { title, subtitle, ctaText, ctaLink, items = [] } = data;
  const [index, setIndex] = useState(0);
  const visible = 3;
  const maxIndex = Math.max(0, items.length - visible);

  const prev = () => setIndex((current) => Math.max(0, current - 1));
  const next = () => setIndex((current) => Math.min(maxIndex, current + 1));

  return (
    <section className="bg-white py-16">
      <div className="container-brand">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-blue-900">{title}</h2>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>

        {items.length === 0 ? (
          <p className="border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            No universities are available.
          </p>
        ) : (
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${index * (100 / visible)}%)`,
              }}
            >
              {items.map((item: any, itemIndex: number) => (
                <div
                  key={itemIndex}
                  className="w-full flex-shrink-0 px-2 md:w-1/3"
                >
                  <div className="h-full overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-blue-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">{item.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length > visible && (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={prev}
                  disabled={index === 0}
                  className="bg-blue-900 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-40"
                  aria-label="Previous universities"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={index === maxIndex}
                  className="bg-blue-900 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-40"
                  aria-label="Next universities"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {ctaLink && (
          <div className="mt-8 text-center">
            <Link to={ctaLink} className="btn-primary">
              {ctaText || 'View More'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
