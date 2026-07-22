import { Schema, model } from 'mongoose';

const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: 'Your Name',
  },
  title: {
    type: String,
    default: 'Full Stack Developer',
  },
  bio: {
    type: String,
    default: 'Passionate developer building amazing web experiences.',
  },
  heroTagline: {
    type: String,
    default: 'I build things for the web',
  },
  heroSubtitle: {
    type: String,
    default: 'Full Stack Developer | UI/UX Enthusiast | Problem Solver',
  },
  skills: [{
    name: { type: String, required: true },
    level: { type: Number, min: 0, max: 100, default: 80 },
    category: { type: String, default: 'General' },
  }],
  experience: [{
    company: String,
    role: String,
    from: Date,
    to: Date,
    current: { type: Boolean, default: false },
    description: String,
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    year: String,
  }],
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  resumeFile: {
    url: String,
    publicId: String,
  },
  avatar: {
    url: String,
    publicId: String,
  },
}, { timestamps: true });

const Profile = model('Profile', profileSchema);

export default Profile;
