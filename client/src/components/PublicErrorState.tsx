interface PublicErrorStateProps {
  message?: string;
}

export default function PublicErrorState({
  message = 'Something went wrong. Please try again later.',
}: PublicErrorStateProps) {
  return (
    <section className="bg-white py-20">
      <div className="container-brand">
        <div
          role="alert"
          className="mx-auto max-w-xl border border-red-200 bg-red-50 p-8 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="mt-3 text-gray-600">{message}</p>
        </div>
      </div>
    </section>
  );
}
