import { useState } from 'react';

export default function TestimonialsSection({ data }: { data: Record<string, any> }) {
  const { title, subtitle, items = [] } = data;
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  if (!items.length) return null;

  const item = items[index];

  return (
    <section className="bg-white py-16">
      <div className="container-brand max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-blue-900">{title}</h2>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>
        <div className="border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className="mx-auto mb-4 h-24 w-24 object-cover"
            />
          )}
          <h3 className="text-xl font-bold text-blue-900">{item.name}</h3>
          <p className="mb-4 text-sm text-gray-500">{item.role}</p>
          <div className="mb-4 text-yellow-400">{'⭐'.repeat(item.rating || 5)}</div>
          <p className="mx-auto max-w-2xl italic text-gray-700">&ldquo;{item.message}&rdquo;</p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={prev} className="bg-blue-900 px-4 py-2 text-white hover:bg-blue-600">‹</button>
          <button onClick={next} className="bg-blue-900 px-4 py-2 text-white hover:bg-blue-600">›</button>
        </div>
      </div>
    </section>
  );
}
