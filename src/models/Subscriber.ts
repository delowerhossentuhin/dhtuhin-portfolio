import { Schema, model, models, type InferSchemaType } from 'mongoose';

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    confirmed: { type: Boolean, default: true },
    unsubscribedAt: Date,
  },
  { timestamps: true },
);

export type SubscriberDoc = InferSchemaType<typeof subscriberSchema>;
export const Subscriber = models.Subscriber ?? model('Subscriber', subscriberSchema);
