import { useEffect, useState } from 'react';
import { getPage, peekPage } from '../api';
import SectionRenderer from '../components/SectionRenderer';
import type { Page } from '../types';

export const defaultHomePage: Page = {
  _id: 'default-home',
  slug: 'home',
  title: 'Lexis Technology | Web Development, Video & Photo Editing',
  metaDescription: 'Lexis Technology is a premier IT and creative agency specializing in website making, viral video editing, photo retouching, and cloud IT solutions.',
  order: 0,
  isVisible: true,
  sections: [
    {
      _id: 's-hero',
      type: 'hero',
      data: {
        headline: 'WE BUILD WEBSITES, CRAFT VIDEOS',
        subheadline: '& SHAPE DIGITAL BRANDS',
        tagline: 'High-Performance Web Development, Cinematic Video Editing & Pixel-Perfect Design',
        ctaText: 'Get a Free Quote',
        ctaLink: '/contact',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
      },
    },
    {
      _id: 's-intro',
      type: 'introCards',
      data: {
        title: 'Empowering Your Digital Evolution',
        description: 'We combine technical engineering with creative media production to build unforgettable digital experiences.',
        cards: [
          {
            title: 'Website Making & Web Apps',
            description: 'Custom responsive websites, SaaS platforms, and e-commerce stores engineered for speed, conversion, and clean code.',
          },
          {
            title: 'Professional Video Editing',
            description: 'Cinematic video cuts for YouTube creators, high-retention viral reels, shorts, podcasts, and brand commercials with sound design.',
          },
          {
            title: 'Photo Editing & Retouching',
            description: 'High-end product manipulation, e-commerce image retouching, logo branding kits, and eye-catching social media creatives.',
          },
        ],
      },
    },
    {
      _id: 's-about',
      type: 'about',
      data: {
        title: 'About Lexis Technology',
        subtitle: 'Technical Precision Meets Creative Vision',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        paragraphs: [
          'At Lexis Technology, we empower modern creators, startups, and growing enterprises with full-spectrum digital solutions. In today’s competitive world, having an extraordinary website and captivating video content is the fastest way to build authority and drive conversions.',
          'Founded by creative technologists and passionate developers, our studio handles every phase of your digital footprint: from custom web applications and lightning-fast landing pages, to viral video editing and professional graphic design. We treat every project like our own with transparent communication and pixel-perfect delivery.',
        ],
        ctaText: 'Explore Our Work',
        ctaLink: '/universities',
      },
    },
    {
      _id: 's-universities',
      type: 'universities',
      data: {
        title: 'Featured Works & Projects',
        subtitle: 'Recent Websites, Video Edits & Creative Campaigns',
        ctaText: 'View Full Portfolio ...',
        ctaLink: '/universities',
        items: [
          {
            name: 'SaaS Analytics & Cloud Dashboard',
            country: 'Web Development',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Commercial Product Launch Promo',
            country: 'Video Editing',
            image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'High-End Studio Jewelry Retouching',
            country: 'Photo Retouching',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Modern E-Commerce Fashion Storefront',
            country: 'Web Development',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Viral Shorts & Instagram Reels Suite',
            country: 'Video Editing',
            image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Corporate Tech Brand Identity & 3D Assets',
            country: 'Brand Design',
            image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
    },
    {
      _id: 's-stats',
      type: 'stats',
      data: {
        title: 'Our Impact In Numbers',
        items: [
          { value: '250+', label: 'Websites & Web Apps Launched' },
          { value: '1,400+', label: 'Videos Edited & Motion Graphics' },
          { value: '3,200+', label: 'Photos Retouched & Graphics Delivered' },
          { value: '99.4%', label: 'Client Satisfaction Rate' },
        ],
      },
    },
    {
      _id: 's-testimonials',
      type: 'testimonials',
      data: {
        title: 'What Our Clients Say',
        subtitle: 'Trusted by Startup Founders, Creators & Growing Businesses',
        items: [
          {
            name: 'Aakash Shrestha',
            role: 'Founder, SaaS Horizon',
            rating: 5,
            message: 'Lexis Technology built our web application from scratch with flawless performance. Their attention to detail in code and UI design is unmatched in the industry.',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          },
          {
            name: 'Pooja Sharma',
            role: 'Content Creator (500K+ Subs)',
            rating: 5,
            message: 'Their video editing team completely leveled up my YouTube channel and Reels. Retention rates went up by 40% in just two months.',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
          },
          {
            name: 'Suman Pokharel',
            role: 'CEO, Apex Retail',
            rating: 5,
            message: 'From our e-commerce web build to our product photos and promotional commercials, Lexis Technology delivered everything on time and exceeded expectations.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          },
          {
            name: 'Sneha Thapa',
            role: 'Marketing Director',
            rating: 5,
            message: 'Fast turnaround, superb communication, and top-tier creative polish. They are our go-to partner for all web and multimedia needs.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
          },
        ],
      },
    },
    {
      _id: 's-contact',
      type: 'contact',
      data: {
        title: 'Request a Free Consultation & Quote',
        address: 'Kathmandu, Nepal / Remote Worldwide',
        phone: '+977-9800000000',
        email: 'contact@lexistechnology.com',
        hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
      },
    },
  ],
};

function mergeHomeUniversities(
  homePage: Page,
  universitiesPage: Page
): Page {
  const universityItems = universitiesPage.sections
    .filter(
      (section) =>
        section.type === 'universityList' ||
        section.type === 'universities'
    )
    .flatMap((section) =>
      Array.isArray(section.data?.items) ? section.data.items : []
    );

  return {
    ...homePage,
    sections: homePage.sections.map((section) =>
      section.type === 'universities'
        ? {
            ...section,
            data: {
              ...section.data,
              items: universityItems.length > 0 ? universityItems : section.data?.items,
            },
          }
        : section
    ),
  };
}

function peekHomePage() {
  const homePage = peekPage('home');
  const universitiesPage = peekPage('universities');
  if (homePage && universitiesPage) {
    return mergeHomeUniversities(homePage, universitiesPage);
  }
  return homePage || defaultHomePage;
}

export default function HomePage() {
  const [page, setPage] = useState<Page>(peekHomePage);

  useEffect(() => {
    let active = true;
    Promise.all([getPage('home'), getPage('universities')])
      .then(([homePage, universitiesPage]) => {
        if (active) {
          setPage(mergeHomeUniversities(homePage, universitiesPage));
        }
      })
      .catch(() => {
        if (active && !page) {
          // Gracefully fallback to default Lexis Technology page
          setPage(defaultHomePage);
        }
      });
    return () => {
      active = false;
    };
  }, [page]);

  return <SectionRenderer sections={page.sections} />;
}
