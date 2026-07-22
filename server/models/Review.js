import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  clientCompany: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    maxlength: 1000,
  },
  tokenId: {
    type: Schema.Types.ObjectId,
    ref: 'ReviewToken',
  },
}, { timestamps: true });

const Review = model('Review', reviewSchema);

export default Review;
