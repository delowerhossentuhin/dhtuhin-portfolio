import { Schema, model, models } from 'mongoose';

const commentSchema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true, index: true },
    blogSlug: { type: String, required: true, index: true },
    content: { type: String, required: true },
    authorName: { type: String, default: 'Anonymous' },
    authorNumber: { type: Number, default: null }, // for anonymous numbering
    isSubscriber: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Comment = models.Comment ?? model('Comment', commentSchema);