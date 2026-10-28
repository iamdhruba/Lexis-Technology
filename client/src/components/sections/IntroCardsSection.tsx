export default function IntroCardsSection({ data }: { data: Record<string, any> }) {
  const { title, description, cards = [] } = data;
  return (
    <section className="bg-white py-16">
      <div className="container-brand">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-blue-900">{title}</h2>
          <p className="mx-auto max-w-2xl text-gray-700">{description}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card: any, idx: number) => (
            <div key={idx} className="border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <h4 className="mb-2 text-xl font-bold text-blue-900">{card.title}</h4>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
