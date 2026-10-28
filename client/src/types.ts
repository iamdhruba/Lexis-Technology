export interface Section {
  _id?: string;
  type: string;
  data: Record<string, any>;
}

export interface Page {
  _id?: string;
  slug: string;
  title: string;
  metaDescription?: string;
  category?: string;
  countryName?: string;
  countryAliases?: string[];
  order: number;
  isVisible: boolean;
  sections: Section[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
