export default function UniversityListSection({ data }: { data: Record<string, any> }) {
  const { title, items = [] } = data;
  return (
    <section className="bg-white py-16">
      <div className="container-brand">
        {title && <h2 className="mb-10 text-center text-3xl font-bold text-blue-900">{title}</h2>}
        {items.length === 0 ? (
          <p className="border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            No universities have been added for this country yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
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
                  <h3 className="text-lg font-bold text-blue-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.country}</p>
                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  )}
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Visit university
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
