import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getPages, peekPages } from '../api';
import { isStudyAbroadPage } from '../constants/navigation';

export interface StudyCountry {
  slug: string;
  to: string;
  label: string;
  countryName: string;
  aliases: string[];
  image: string;
  description: string;
  highlights: string[];
}

export const fallbackServices: StudyCountry[] = [
  {
    slug: 'web-development',
    to: '/web-development',
    label: 'Website Making & Web Apps',
    countryName: 'Web Development',
    aliases: ['Web Development', 'Website', 'Websites', 'Web Design'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Custom business websites, web applications, and high-performance digital platforms.',
    highlights: ['React & Next.js', 'Mobile-First Design', 'Speed & SEO'],
  },
  {
    slug: 'video-editing',
    to: '/video-editing',
    label: 'Professional Video Editing',
    countryName: 'Video Editing',
    aliases: ['Video Editing', 'Video Production', 'Shorts', 'Reels'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    description: 'Cinematic video editing for YouTube creators, viral reels, shorts, and commercials.',
    highlights: ['Viral Retention', 'Sound Design', '4K Color Grading'],
  },
  {
    slug: 'photo-editing',
    to: '/photo-editing',
    label: 'Photo Editing & Retouching',
    countryName: 'Photo Editing',
    aliases: ['Photo Editing', 'Graphic Design', 'Photo Retouching', 'Branding'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description: 'High-end product manipulation, e-commerce image retouching, and brand identity kits.',
    highlights: ['Product Retouching', 'Brand Identity', 'Social Media Creatives'],
  },
  {
    slug: 'it-solutions',
    to: '/it-solutions',
    label: 'Managed IT & Cloud Services',
    countryName: 'IT Solutions',
    aliases: ['IT Solutions', 'Cloud Hosting', 'Maintenance', 'IT Support'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    description: 'Domain configuration, cloud server deployment, SSL security, and 24/7 technical monitoring.',
    highlights: ['Cloud Deployment', 'Security Audits', 'Ongoing Maintenance'],
  },
];

interface StudyAbroadContextValue {
  countries: StudyCountry[];
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

const StudyAbroadContext = createContext<StudyAbroadContextValue>({
  countries: fallbackServices,
  loading: false,
  error: false,
  refresh: async () => {},
});

function toStudyCountries(pages: Awaited<ReturnType<typeof getPages>>) {
  const filtered = pages
    .filter((page) => isStudyAbroadPage(page) && page.isVisible)
    .map((page) => {
      const countryName =
        page.countryName ||
        page.title.replace(/^(Services in|Study in)\s+/i, '') ||
        page.title;
      const heroSection = page.sections.find(
        (section) => section.type === 'pageHero'
      );
      const richTextSection = page.sections.find(
        (section) => section.type === 'richText'
      );
      const featuresSection = page.sections.find(
        (section) => section.type === 'features'
      );
      const richText = String(richTextSection?.data?.content || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const description =
        page.metaDescription?.trim() ||
        richText ||
        `Explore specialized services for ${countryName}.`;
      return {
        slug: page.slug,
        to: `/${page.slug}`,
        label: page.title,
        countryName,
        aliases: page.countryAliases?.length
          ? page.countryAliases
          : [countryName],
        image: String(heroSection?.data?.backgroundImage || ''),
        description:
          description.length > 180
            ? `${description.slice(0, 177).trim()}...`
            : description,
        highlights: Array.isArray(featuresSection?.data?.items)
          ? featuresSection.data.items
              .map((item: Record<string, any>) =>
                String(item.title || '').trim()
              )
              .filter(Boolean)
              .slice(0, 3)
          : [],
      };
    });

  return filtered.length > 0 ? filtered : fallbackServices;
}

export function StudyAbroadProvider({ children }: { children: ReactNode }) {
  const cachedPages = peekPages();
  const [countries, setCountries] = useState<StudyCountry[]>(() =>
    cachedPages ? toStudyCountries(cachedPages) : fallbackServices
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const refresh = async () => {
    try {
      setError(false);
      const pages = await getPages();
      setCountries(toStudyCountries(pages));
    } catch {
      setCountries(fallbackServices);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <StudyAbroadContext.Provider
      value={{ countries, loading, error, refresh }}
    >
      {children}
    </StudyAbroadContext.Provider>
  );
}

export function useStudyAbroad() {
  return useContext(StudyAbroadContext);
}
