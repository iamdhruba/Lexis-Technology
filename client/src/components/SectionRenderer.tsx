import HeroSection from './sections/HeroSection';
import IntroCardsSection from './sections/IntroCardsSection';
import AboutSection from './sections/AboutSection';
import StatsSection from './sections/StatsSection';
import UniversitiesSection from './sections/UniversitiesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import PageHeroSection from './sections/PageHeroSection';
import RichTextSection from './sections/RichTextSection';
import FeaturesSection from './sections/FeaturesSection';
import UniversityListSection from './sections/UniversityListSection';
import type { ReactNode } from 'react';
import type { Section } from '../types';

type SectionComponent = (props: { data: Record<string, any> }) => ReactNode;

const componentMap: Record<string, SectionComponent> = {
  hero: HeroSection,
  introCards: IntroCardsSection,
  about: AboutSection,
  stats: StatsSection,
  universities: UniversitiesSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  pageHero: PageHeroSection,
  richText: RichTextSection,
  features: FeaturesSection,
  universityList: UniversityListSection,
};

interface SectionRendererProps {
  sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, idx) => {
        const Component = componentMap[section.type];
        if (!Component) return null;
        return (
          <section key={section._id || idx}>
            <Component data={section.data || {}} />
          </section>
        );
      })}
    </>
  );
}
