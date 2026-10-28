import { Link } from 'react-router-dom';

export default function AboutSection({ data }: { data: Record<string, any> }) {
  const { title, subtitle, image, paragraphs = [], ctaText, ctaLink } = data;
  return (
    <section className="py-16">
      <div className="container-brand grid items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h2 className="mb-2 text-3xl font-bold text-blue-900">{title}</h2>
          <h3 className="mb-6 text-xl font-semibold text-blue-600">{subtitle}</h3>
          <div className="space-y-4 text-gray-700">
            {paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          {ctaLink && (
            <Link to={ctaLink}>
              <button className="btn-primary mt-6">{ctaText || 'Learn More'}</button>
            </Link>
          )}
        </div>
        <div className="order-1 md:order-2">
          {image && (
            <img
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
              className="w-full shadow-lg"
            />
          )}
        </div>
      </div>
    </section>
  );
}
