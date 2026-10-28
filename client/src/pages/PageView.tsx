import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPage, peekPage } from '../api';
import SectionRenderer from '../components/SectionRenderer';
import UniversityListSection from '../components/sections/UniversityListSection';
import PublicErrorState from '../components/PublicErrorState';
import { useStudyAbroad } from '../context/StudyAbroadContext';
import type { Page } from '../types';

export const fallbackPages: Record<string, Page> = {
  about: {
    _id: 'fb-about',
    slug: 'about',
    title: 'About Us | Lexis Technology',
    order: 1,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'About Lexis Technology',
          subtitle: 'Our Mission, Values & Creative Engineering',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'richText',
        data: {
          content: '<div class="space-y-4"><p><strong>Lexis Technology</strong> is an elite digital production and technology agency. We exist to help businesses, entrepreneurs, and content creators turn their visions into scalable web platforms and high-converting visual media.</p><p>We believe that outstanding software engineering and world-class digital storytelling should not be isolated. By combining modern full-stack development with cinematic video editing and high-end graphic design, we provide a unified partner for your entire digital brand.</p></div>',
        },
      },
      {
        type: 'features',
        data: {
          title: 'Why Choose Lexis Technology?',
          items: [
            { title: 'Modern Architecture', description: 'We build with React, Next.js, Node.js, and modern cloud stacks designed for lightning speed and bank-grade security.' },
            { title: 'High-Retention Video Editing', description: 'Our video editors specialize in pacing, sound design, and visual hooks that stop scrolling and boost audience retention.' },
            { title: 'Transparent Pricing & SLAs', description: 'No hidden fees. We work with clear milestones, rapid iterations, and dedicated 1-on-1 support.' },
          ],
        },
      },
    ],
  },
  services: {
    _id: 'fb-services',
    slug: 'services',
    title: 'Our Services | Lexis Technology',
    order: 2,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'Complete IT & Creative Services',
          subtitle: 'Everything You Need To Build & Scale Your Digital Presence',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'features',
        data: {
          title: 'Our Flagship Solutions',
          items: [
            { title: 'Website Making & Web Apps', description: 'Custom corporate websites, SaaS web applications, e-commerce storefronts, and conversion-optimized landing pages.' },
            { title: 'Professional Video Editing', description: 'Viral Shorts, TikTok & Reels, YouTube long-form content, corporate promo videos, 4K color grading, and motion graphics.' },
            { title: 'Photo Editing & Graphic Design', description: 'High-end product retouching, brand identity packages, logo design, marketing banners, and social media creative suites.' },
            { title: 'Managed IT & Cloud Hosting', description: 'Domain configuration, cloud server deployment, SSL security certificates, website maintenance, and 24/7 technical monitoring.' },
            { title: 'UI/UX Design & Prototyping', description: 'Figma wireframes, interactive user journey prototypes, design systems, and responsive design guidelines.' },
            { title: 'SEO & Performance Optimization', description: 'Core Web Vitals auditing, Google Search Console optimization, structured schema data, and sub-second page loads.' },
          ],
        },
      },
    ],
  },
  'web-development': {
    _id: 'fb-web-dev',
    slug: 'web-development',
    title: 'Website Making & Web Development',
    order: 3,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'Website Making & Web Development',
          subtitle: 'High-Speed, Custom Engineered Web Experiences',
          backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'richText',
        data: {
          content: '<p>At Lexis Technology, we engineer custom web platforms tailored to your business model. Whether you need a corporate business website, an e-commerce platform with Stripe checkout, or a bespoke React/Next.js web application, we guarantee fast, secure, and responsive results.</p>',
        },
      },
      {
        type: 'features',
        data: {
          title: 'Web Engineering Capabilities',
          items: [
            { title: 'Custom Front-End & Back-End', description: 'Built with React, Next.js, Node.js, and TypeScript for exceptional performance.' },
            { title: 'Responsive Mobile-First Design', description: 'Flawless presentation on every smartphone, tablet, laptop, and 4K desktop display.' },
            { title: 'SEO & Conversion Architecture', description: 'Built-in schema, meta tags, and high-speed loading for top Google search rankings.' },
          ],
        },
      },
    ],
  },
  'video-editing': {
    _id: 'fb-video',
    slug: 'video-editing',
    title: 'Professional Video Editing',
    order: 4,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'Cinematic Video Editing & Production',
          subtitle: 'Viral Retention, Dynamic Pacing & Sound Design',
          backgroundImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'richText',
        data: {
          content: '<p>Video is the dominant medium on the internet today. Our editors craft dynamic, high-retention video content for YouTube creators, Instagram Reels, TikTok, podcasts, and commercial advertisements.</p>',
        },
      },
      {
        type: 'features',
        data: {
          title: 'Video Production Services',
          items: [
            { title: 'Viral Shorts & Reels', description: 'Fast-paced cuts, captions, animations, and sound effects proven to boost watch time.' },
            { title: 'YouTube Long-Form Edits', description: 'Storytelling, narrative pacing, B-roll integration, and clean chapter structuring.' },
            { title: 'Color Grading & Motion Graphics', description: 'Cinema-grade color correction, custom lower thirds, intro/outro animations, and SFX.' },
          ],
        },
      },
    ],
  },
  'photo-editing': {
    _id: 'fb-photo',
    slug: 'photo-editing',
    title: 'Photo Editing & Graphic Design',
    order: 5,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'High-End Photo Retouching & Graphic Design',
          subtitle: 'Studio Retouching, Brand Kits & Marketing Creatives',
          backgroundImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'richText',
        data: {
          content: '<p>Visual perfection matters. From studio product manipulation to comprehensive brand identity kits, we create high-resolution imagery that makes your products and marketing materials irresistible.</p>',
        },
      },
      {
        type: 'features',
        data: {
          title: 'Design & Retouching Services',
          items: [
            { title: 'E-Commerce Product Retouching', description: 'Background removal, skin softening, color matching, and reflective surface polishing.' },
            { title: 'Brand Identity & Logo Design', description: 'Custom typography, vectorized logos, business stationery, and brand guidelines.' },
            { title: 'Social Media Creatives & Banners', description: 'High-CTR YouTube thumbnails, Instagram post bundles, and advertising banners.' },
          ],
        },
      },
    ],
  },
  'it-solutions': {
    _id: 'fb-it',
    slug: 'it-solutions',
    title: 'Managed IT & Cloud Infrastructure',
    order: 6,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'Managed IT & Cloud Infrastructure',
          subtitle: 'Server Setup, Maintenance, Security & Support',
          backgroundImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'richText',
        data: {
          content: '<p>Keep your digital infrastructure running seamlessly without downtime. We handle the technical complexities of cloud hosting, domains, security, and ongoing updates so you can focus on growing your business.</p>',
        },
      },
      {
        type: 'features',
        data: {
          title: 'IT Support Services',
          items: [
            { title: 'High-Speed Cloud Hosting', description: 'Configuration of AWS, Vercel, VPS, and cloud environments with automated backups.' },
            { title: 'Security & SSL Audits', description: 'SSL certificate installation, malware scanning, DDoS protection, and database security.' },
            { title: 'Continuous Maintenance & Support', description: 'Framework updates, bug fixing, uptime monitoring, and priority technical support.' },
          ],
        },
      },
    ],
  },
  universities: {
    _id: 'fb-portfolio',
    slug: 'universities',
    title: 'Our Portfolio & Works',
    order: 7,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'Our Portfolio & Works',
          subtitle: 'A Showcase of Websites, Video Edits & Graphic Creations',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'universityList',
        data: {
          title: 'Selected Client Projects',
          items: [
            { name: 'SaaS Analytics & Cloud Dashboard', country: 'Web Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' },
            { name: 'Commercial Product Launch Promo', country: 'Video Editing', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80' },
            { name: 'High-End Studio Jewelry Retouching', country: 'Photo Retouching', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
            { name: 'Modern E-Commerce Fashion Storefront', country: 'Web Development', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
            { name: 'Viral Shorts & Instagram Reels Suite', country: 'Video Editing', image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80' },
            { name: 'Corporate Tech Brand Identity & 3D Assets', country: 'Brand Design', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80' },
          ],
        },
      },
    ],
  },
  team: {
    _id: 'fb-team',
    slug: 'team',
    title: 'Our Team | Lexis Technology',
    order: 8,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'Meet Our Experts',
          subtitle: 'The Technologists & Creatives Behind Lexis Technology',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'features',
        data: {
          title: 'Leadership & Creative Direction',
          items: [
            { title: 'Lead Full-Stack Architect', description: 'Specializes in high-performance web systems, cloud infrastructure, and modern JavaScript frameworks.', image: '' },
            { title: 'Head of Video Production', description: 'Cinema colorist and video editor specializing in YouTube pacing, viral hooks, and commercial commercials.', image: '' },
            { title: 'Senior Art & Design Director', description: 'Expert in high-end photo retouching, 3D asset generation, and complete corporate brand identity systems.', image: '' },
          ],
        },
      },
    ],
  },
  contact: {
    _id: 'fb-contact',
    slug: 'contact',
    title: 'Contact Us | Lexis Technology',
    order: 9,
    isVisible: true,
    sections: [
      {
        type: 'pageHero',
        data: {
          title: 'Get In Touch',
          subtitle: 'Request a Free Project Estimate & Consultation',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'contact',
        data: {
          title: 'Send Us Your Project Brief',
          address: 'Kathmandu, Nepal / Remote Worldwide',
          phone: '+977-9800000000',
          email: 'contact@lexistechnology.com',
          hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
        },
      },
    ],
  },
};

function getUniversityItems(page?: Page) {
  if (!page) return [];
  return page.sections
    .filter(
      (section) =>
        section.type === 'universityList' ||
        section.type === 'universities'
    )
    .flatMap((section) =>
      Array.isArray(section.data?.items) ? section.data.items : []
    );
}

export default function PageView({ slug: propSlug }: { slug?: string }) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = propSlug || paramSlug || 'home';
  const [page, setPage] = useState<Page | null>(() =>
    slug ? peekPage(slug) || fallbackPages[slug] || null : null
  );
  const cachedUniversitiesPage = peekPage('universities') || fallbackPages['universities'];
  const [universities, setUniversities] = useState<Record<string, any>[]>(() =>
    getUniversityItems(cachedUniversitiesPage)
  );
  const [error, setError] = useState('');
  const {
    countries: countryLinks,
    loading: countriesLoading,
  } = useStudyAbroad();
  const selectedCountry = countryLinks.find((country) => country.slug === slug);
  const currentPage =
    page?.slug === slug ? page : slug ? peekPage(slug) || fallbackPages[slug] || null : null;

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setError('');
    getPage(slug)
      .then((p) => {
        if (active) setPage(p);
      })
      .catch(() => {
        if (active) {
          if (fallbackPages[slug]) {
            setPage(fallbackPages[slug]);
          } else if (!peekPage(slug)) {
            setError('This page could not be loaded. Please try again later.');
          }
        }
      });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!selectedCountry) {
      return;
    }

    let active = true;
    const cachedPage = peekPage('universities') || fallbackPages['universities'];
    if (cachedPage) {
      setUniversities(getUniversityItems(cachedPage));
    }
    getPage('universities')
      .then((universitiesPage) => {
        if (active) setUniversities(getUniversityItems(universitiesPage));
      })
      .catch(() => {
        if (active && !cachedPage) {
          setUniversities([]);
        }
      });
    return () => {
      active = false;
    };
  }, [selectedCountry?.slug]);

  if (error && !currentPage) return <PublicErrorState message={error} />;
  if (!currentPage) return <div className="py-20 text-center text-gray-500">Loading page...</div>;

  const isCountryPage =
    currentPage.category === 'study-abroad' || Boolean(selectedCountry);
  if (isCountryPage && countriesLoading && !selectedCountry) {
    return <div className="py-20 text-center text-gray-500">Loading services...</div>;
  }

  if (!selectedCountry) {
    return <SectionRenderer sections={currentPage.sections} />;
  }

  const heroSections = currentPage.sections.filter((section) => section.type === 'pageHero');
  const contentSections = currentPage.sections.filter((section) => section.type !== 'pageHero');
  const countryIntroduction = contentSections.find(
    (section) => section.type === 'richText'
  );
  let introductionPlaced = false;
  const countryDetailSections = contentSections
    .filter((section) => section !== countryIntroduction)
    .map((section) => {
      if (
        !introductionPlaced &&
        countryIntroduction &&
        section.type === 'features'
      ) {
        introductionPlaced = true;
        return {
          ...section,
          data: {
            ...section.data,
            descriptionHtml: countryIntroduction.data?.content || '',
          },
        };
      }
      return section;
    });
  if (countryIntroduction && !introductionPlaced) {
    countryDetailSections.unshift(countryIntroduction);
  }
  const normalizedAliases = (selectedCountry.aliases || []).map((alias) => alias.toLowerCase());
  const countryUniversities = universities.filter((university) =>
    normalizedAliases.includes(String(university.country || '').trim().toLowerCase())
  );

  return (
    <>
      <SectionRenderer sections={heroSections} />
      {countryUniversities.length > 0 && (
        <UniversityListSection
          data={{
            title: `Featured Projects in ${selectedCountry.countryName}`,
            items: countryUniversities,
          }}
        />
      )}
      <SectionRenderer sections={countryDetailSections} />
    </>
  );
}
