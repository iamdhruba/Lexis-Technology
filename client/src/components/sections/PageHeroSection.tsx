export default function PageHeroSection({ data }: { data: Record<string, any> }) {
  const { title, subtitle, backgroundImage } = data;
  return (
    <div
      className="relative flex min-h-[300px] items-center justify-center bg-cover bg-center px-4 text-white"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})` }}
    >
      <div className="container-brand text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-2 text-lg text-gray-200">{subtitle}</p>}
      </div>
    </div>
  );
}
