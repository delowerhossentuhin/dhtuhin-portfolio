import { Schema, model, models, type InferSchemaType } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    ip: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ContactDoc = InferSchemaType<typeof contactSchema>;
export const ContactMessage = models.ContactMessage ?? model('ContactMessage', contactSchema);
