import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  socialLinks: { platform: string; url: string }[];
  footerColumns: { title: string; items: { label: string; url?: string }[] }[];
  countriesInitialized: boolean;
  universitiesInitialized: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: 'Lexis Technology' },
    logo: { type: String, default: '/logo.png' },
    phone: { type: String, default: '+977-XXXXXXXXXX' },
    email: { type: String, default: 'info@lexistechnology.com' },
    address: { type: String, default: 'Kathmandu, Nepal' },
    hours: { type: String, default: 'Sunday - Friday: 9:00 AM - 6:00 PM' },
    socialLinks: { type: [Object], default: [] },
    footerColumns: { type: [Object], default: [] },
    countriesInitialized: { type: Boolean, default: false },
    universitiesInitialized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
