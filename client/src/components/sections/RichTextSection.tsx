import DOMPurify from 'dompurify';

export default function RichTextSection({ data }: { data: Record<string, any> }) {
  const clean = DOMPurify.sanitize(data.content || '');
  return (
    <section className="py-12">
      <div className="container-brand max-w-4xl">
        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: clean }} />
      </div>
    </section>
  );
}
