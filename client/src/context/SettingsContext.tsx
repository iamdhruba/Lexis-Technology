import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';

export interface SiteSettings {
  siteName: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  socialLinks: { platform: string; url: string }[];
  footerColumns: { title: string; items: { label: string; url?: string }[] }[];
}

export const defaultSiteSettings: SiteSettings = {
  siteName: 'Lexis Technology',
  logo: '/logo.png',
  phone: '+977-9800000000',
  email: 'contact@lexistechnology.com',
  address: 'Kathmandu, Nepal / Remote Worldwide',
  hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
  socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com/lexistechnology' },
    { platform: 'instagram', url: 'https://instagram.com/lexistechnology' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/lexistechnology' },
    { platform: 'youtube', url: 'https://youtube.com/@lexistechnology' },
  ],
  footerColumns: [
    {
      title: 'CORE SERVICES',
      items: [
        { label: 'Website Making & Web Apps', url: '/web-development' },
        { label: 'Video Editing & Reels', url: '/video-editing' },
        { label: 'Photo Retouching & Design', url: '/photo-editing' },
        { label: 'Managed IT & Cloud Hosting', url: '/it-solutions' },
        { label: 'E-Commerce Development', url: '/web-development' },
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
  ],
};

interface SettingsContextValue {
  settings: SiteSettings | null;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSiteSettings,
  loading: false,
  error: false,
  refresh: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(false);
  const [error] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data) {
        setSettings(res.data);
      }
    } catch {
      // Fallback to default Lexis Technology settings gracefully
      setSettings(defaultSiteSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, loading, error, refresh: fetchSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
