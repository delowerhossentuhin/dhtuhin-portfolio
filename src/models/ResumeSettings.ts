import { Schema, model, models } from 'mongoose';

const resumeSettingsSchema = new Schema(
  {
    cvUrl: { type: String, default: '' },
    updatedLabel: { type: String, default: 'April 2026' },
  },
  { timestamps: true },
);

export const ResumeSettings = models.ResumeSettings ?? model('ResumeSettings', resumeSettingsSchema);