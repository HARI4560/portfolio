import { Schema, model } from 'mongoose';

const reviewTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
  },
  used: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Virtual to check if token is expired
reviewTokenSchema.virtual('isExpired').get(function () {
  return Date.now() > this.expiresAt;
});

// Ensure virtuals are included in JSON
reviewTokenSchema.set('toJSON', { virtuals: true });
reviewTokenSchema.set('toObject', { virtuals: true });

export default model('ReviewToken', reviewTokenSchema);
