export default function StatsSection({ data }: { data: Record<string, any> }) {
  const { title, items = [] } = data;
  return (
    <section className="bg-white py-16">
      <div className="container-brand">
        {title && <h2 className="mb-10 text-center text-3xl font-bold text-blue-900">{title}</h2>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mb-2 text-4xl font-extrabold text-blue-600">{item.value}</div>
              <div className="text-lg font-medium text-gray-700">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
