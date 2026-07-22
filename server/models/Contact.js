import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Contact = model('Contact', contactSchema);

export default Contact;
