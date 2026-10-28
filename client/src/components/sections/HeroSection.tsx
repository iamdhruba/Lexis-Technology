import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function HeroSection({ data }: { data: Record<string, any> }) {
  const { headline, subheadline, tagline, ctaText, ctaLink, backgroundImage } = data;
  const { settings } = useSettings();
  const phoneNumber = settings?.phone?.trim() || '';
  const dialNumber = phoneNumber.replace(/[^\d+]/g, '');
  const hasCallableNumber = dialNumber.replace(/\D/g, '').length >= 7;

  return (
    <div
      className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center bg-cover bg-center px-4 text-white"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})` }}
    >
      <div className="container-brand text-center">
        <h1 className="mb-2 text-4xl font-extrabold uppercase tracking-wide md:text-6xl">
          {headline || 'Study beyond borders'}
        </h1>
        <h2 className="mb-4 text-3xl font-bold uppercase text-blue-600 md:text-5xl">
          {subheadline || 'succeed without limits'}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200">{tagline}</p>
        {hasCallableNumber ? (
          <a
            href={`tel:${dialNumber}`}
            aria-label={`Call ${phoneNumber}`}
            className="btn-primary inline-block text-lg"
          >
            {ctaText || 'Schedule a Call'}
          </a>
        ) : ctaLink ? (
          <Link to={ctaLink} className="btn-primary inline-block text-lg">
            {ctaText || 'Schedule a Call'}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
