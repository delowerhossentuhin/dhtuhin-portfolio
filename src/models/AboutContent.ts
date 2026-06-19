import { Schema, model, models } from 'mongoose';

const TimelineItemSchema = new Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    blurb: { type: String, required: true },
    tag: { type: String, default: 'Past' },
  },
  { _id: false },
);

const EducationItemSchema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    period: { type: String, required: true },
    score: { type: String, default: '' },
    highlights: { type: [String], default: [] },
  },
  { _id: false },
);

const AchievementItemSchema = new Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    year: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Trophy' },
  },
  { _id: false },
);

const MembershipItemSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    period: { type: String, default: '' },
    id: { type: String, default: null },
    note: { type: String, default: '' },
  },
  { _id: false },
);

const LanguageItemSchema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: String, default: '' },
    breakdown: { type: String, default: '' },
  },
  { _id: false },
);

const aboutContentSchema = new Schema(
  {
    photoUrl: { type: String, default: '' },
    photoCaption: { type: String, default: '' },
    bioParagraphs: { type: [String], default: [] },
    philosophy: { type: String, default: '' },
    factLocation: { type: String, default: '' },
    factStatus: { type: String, default: '' },
    factGpa: { type: String, default: '' },
    factNext: { type: String, default: '' },
    timeline: { type: [TimelineItemSchema], default: [] },
    education: { type: [EducationItemSchema], default: [] },
    achievements: { type: [AchievementItemSchema], default: [] },
    memberships: { type: [MembershipItemSchema], default: [] },
    languages: { type: [LanguageItemSchema], default: [] },
  },
  { timestamps: true },
);

export const AboutContent = models.AboutContent ?? model('AboutContent', aboutContentSchema);