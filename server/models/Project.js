import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  shortDescription: {
    type: String,
    maxlength: 200,
  },
  techStack: [{
    type: String,
    trim: true,
  }],
  thumbnail: {
    url: String,
    publicId: String,
  },
  images: [{
    url: String,
    publicId: String,
  }],
  liveUrl: {
    type: String,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default model('Project', projectSchema);
