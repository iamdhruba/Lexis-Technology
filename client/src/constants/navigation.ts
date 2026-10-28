export const serviceLinks = [
  {
    slug: 'web-development',
    to: '/web-development',
    label: 'Website Making & Web Apps',
    countryName: 'Web Development',
    aliases: ['Web Development', 'Web', 'Website', 'Websites', 'Web Design', 'america', 'USA'],
  },
  {
    slug: 'video-editing',
    to: '/video-editing',
    label: 'Professional Video Editing',
    countryName: 'Video Editing',
    aliases: ['Video Editing', 'Video', 'Reels', 'Shorts', 'YouTube', 'uk', 'UK'],
  },
  {
    slug: 'photo-editing',
    to: '/photo-editing',
    label: 'Photo Retouching & Design',
    countryName: 'Photo Editing',
    aliases: ['Photo Editing', 'Photo Retouching', 'Graphic Design', 'Graphics', 'canada', 'Canada'],
  },
  {
    slug: 'it-solutions',
    to: '/it-solutions',
    label: 'Managed IT & Cloud Services',
    countryName: 'IT Solutions',
    aliases: ['IT Solutions', 'Cloud Hosting', 'Hosting', 'Support', 'australia', 'Australia'],
  },
];

export const countryLinks = serviceLinks;

const defaultCountrySlugs = new Set(
  countryLinks.map((country) => country.slug)
);

export function isStudyAbroadPage(page: {
  slug: string;
  title: string;
  category?: string;
}) {
  return (
    page.category === 'services' ||
    page.category === 'study-abroad' ||
    defaultCountrySlugs.has(page.slug) ||
    /^(Services in|Study in)\s+/i.test(page.title)
  );
}
