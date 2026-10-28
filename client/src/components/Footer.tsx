import { Link } from 'react-router-dom';
import { useSettings, defaultSiteSettings } from '../context/SettingsContext';
import { useStudyAbroad, fallbackServices } from '../context/StudyAbroadContext';
import BrandName from './BrandName';

const defaultColumns = [
  {
    title: 'CORE SERVICES',
    items: [
      { label: 'Website Making & Web Apps', url: '/web-development' },
      { label: 'Video Editing & Reels', url: '/video-editing' },
      { label: 'Photo Retouching & Design', url: '/photo-editing' },
      { label: 'Managed IT & Cloud Hosting', url: '/it-solutions' },
      { label: 'E-Commerce Solutions', url: '/web-development' },
      { label: 'Brand Identity Kits', url: '/photo-editing' },
    ],
  },
  {
    title: 'COMPANY',
    items: [
      { label: 'About Us', url: '/about' },
      { label: 'Our Portfolio', url: '/universities' },
      { label: 'Creative Team', url: '/team' },
      { label: 'Services Overview', url: '/services' },
    ],
  },
  {
    title: 'QUICK LINKS',
    items: [
      { label: 'Get a Free Quote', url: '/contact' },
      { label: 'Pricing & Packages', url: '/services' },
      { label: 'Contact Support', url: '/contact' },
    ],
  },
];

function FooterLink({ item }: { item: { label: string; url?: string } }) {
  const className =
    'inline-block text-white/75 transition hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

  const url = /^study destinations?$/i.test(item.label.trim())
    ? '/services'
    : item.url;

  if (!url) return <span className="text-white/75">{item.label}</span>;

  if (url.startsWith('/')) {
    return (
      <Link to={url} className={className}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={url} className={className}>
      {item.label}
    </a>
  );
}

export default function Footer() {
  const { settings } = useSettings();
  const { countries: serviceLinks } = useStudyAbroad();

  // Always use active settings or fallback so the footer never breaks
  const activeSettings = settings || defaultSiteSettings;
  const siteName = activeSettings.siteName || 'Lexis Technology';
  const columns = activeSettings.footerColumns?.length
    ? activeSettings.footerColumns
    : defaultColumns;
  const phone = activeSettings.phone || '+977-9800000000';
  const email = activeSettings.email || 'contact@lexistechnology.com';
  const address = activeSettings.address || 'Kathmandu, Nepal / Remote Worldwide';
  const hours = activeSettings.hours || 'Monday - Saturday: 9:00 AM - 6:00 PM';
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  const activeServiceLinks =
    serviceLinks && serviceLinks.length > 0 ? serviceLinks : fallbackServices;

  return (
    <footer className="bg-[#0a0f1d] text-white">
      <div className="container-brand py-12 lg:py-16">
        <div className="mb-10 flex flex-col gap-6 border-b border-white/15 pb-10 lg:flex-row lg:items-center lg:justify-between">
          <Link
            to="/"
            aria-label={`${siteName} home`}
            className="inline-flex w-fit items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex h-14 w-14 items-center justify-center bg-blue-600 text-white font-extrabold text-2xl shadow-lg">
              L
            </div>
            <div>
              <BrandName
                name={siteName}
                className="block text-xl font-bold tracking-tight sm:text-2xl"
              />
              <p className="mt-1 text-sm text-white/65">
                Next-Gen IT & Creative Media Studio. Websites, Video Editing & Design.
              </p>
            </div>
          </Link>

          <Link
            to="/contact"
            className="w-fit bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Get a Free Quote
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {columns.slice(0, 3).map((column) => (
            <section key={column.title}>
              <h2 className="mb-4 text-sm font-bold tracking-wider text-blue-300 uppercase">
                {column.title}
              </h2>
              <ul className="space-y-2.5 text-sm leading-6">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h2 className="mb-4 text-sm font-bold tracking-wider text-blue-300 uppercase">
              SERVICES
            </h2>
            <ul className="space-y-2.5 text-sm leading-6">
              <li>
                <Link
                  to="/services"
                  className="inline-block font-semibold text-blue-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  All Services
                </Link>
              </li>
              {activeServiceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block text-white/75 transition hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-bold tracking-wider text-blue-300 uppercase">
              CONTACT
            </h2>
            <address className="space-y-3 text-sm not-italic leading-6 text-white/75">
              <p>{address}</p>
              <p>
                <a className="transition hover:text-white" href={`mailto:${email}`}>
                  {email}
                </a>
              </p>
              <p>
                <a className="transition hover:text-white" href={phoneHref}>
                  {phone}
                </a>
              </p>
              <p className="max-w-xs">{hours}</p>
            </address>

            {!!activeSettings?.socialLinks?.length && (
              <div className="mt-5 flex flex-wrap gap-2">
                {activeSettings.socialLinks.map((social) => (
                  <a
                    key={`${social.platform}-${social.url}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/20 px-3 py-1.5 text-xs font-semibold capitalize text-white/80 transition hover:border-blue-300 hover:text-blue-300"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#070b16]">
        <div className="container-brand flex flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p>Privacy Policy &bull; Terms of Service &bull; Quality Guarantee</p>
        </div>
      </div>
    </footer>
  );
}
