import mongoose, { Document, Schema } from 'mongoose';

export interface Section {
  _id?: string;
  type: string;
  data: Record<string, any>;
}

export interface IPage extends Document {
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

const SectionSchema = new Schema<Section>(
  {
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true }
);

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    metaDescription: { type: String },
    category: { type: String, default: '' },
    countryName: { type: String, default: '' },
    countryAliases: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IPage>('Page', PageSchema);
