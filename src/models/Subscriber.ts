import { Schema, model, models, type InferSchemaType } from 'mongoose';

const subscriberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    confirmed: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type SubscriberDoc = InferSchemaType<typeof subscriberSchema>;
export const Subscriber = models.Subscriber ?? model('Subscriber', subscriberSchema);