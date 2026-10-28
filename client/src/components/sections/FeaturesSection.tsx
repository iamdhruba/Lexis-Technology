import DOMPurify from 'dompurify';

export default function FeaturesSection({ data }: { data: Record<string, any> }) {
  const { title, descriptionHtml, items = [] } = data;
  const hasImageCards = items.some((item: any) => Boolean(item.image));
  const cleanDescription = DOMPurify.sanitize(descriptionHtml || '');
  return (
    <section className="bg-white py-16">
      <div className="container-brand">
        {title && (
          <h2 className="text-center text-3xl font-bold text-blue-900">
            {title}
          </h2>
        )}
        {cleanDescription && (
          <div
            className="prose mx-auto mt-4 max-w-3xl text-center text-gray-700"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />
        )}
        <div
          className={`mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${
            hasImageCards ? 'mx-auto max-w-5xl justify-items-center' : ''
          }`}
        >
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`border-l-4 border-blue-600 bg-blue-100 shadow-sm ${
                hasImageCards ? 'w-full max-w-sm' : ''
              }`}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title || 'Team member'}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-contain"
                />
              )}
              <div className="p-6">
                <h4 className="mb-2 text-lg font-bold text-blue-900">{item.title}</h4>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
