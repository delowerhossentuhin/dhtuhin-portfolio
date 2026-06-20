import { Schema, model, models } from 'mongoose';

const heroContentSchema = new Schema(
  {
    statusBadge: { type: String, default: 'Open to PhD positions for Fall 2026' },
    headlinePart1: { type: String, default: 'Research that' },
    headlineEm1: { type: String, default: 'scales' },
    headlinePart2: { type: String, default: 'built where it' },
    headlineEm2: { type: String, default: 'matters' },
    introText: { type: String, default: '' },
    taglines: { type: [String], default: [] },
    stat1Value: { type: String, default: '7' },
    stat1Label: { type: String, default: 'Publications' },
    stat1Suffix: { type: String, default: 'incl. Q1' },
    stat2Value: { type: String, default: '3' },
    stat2Label: { type: String, default: 'Research Labs' },
    stat2Suffix: { type: String, default: 'active' },
    stat3Value: { type: String, default: 'Fall 26' },
    stat3Label: { type: String, default: 'PhD Target' },
    stat3Suffix: { type: String, default: 'intake' },
    portraitUrl: { type: String, default: '' },
    portraitLocation: { type: String, default: 'Dhaka · Bangladesh' },
  },
  { timestamps: true },
);

export const HeroContent = models.HeroContent ?? model('HeroContent', heroContentSchema);