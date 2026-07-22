import Contact from '../models/Contact.js';

// @desc    Submit contact form (public)
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all messages (admin)
// @route   GET /api/contact
// @access  Private (Admin)
const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Private (Admin)
const markAsRead = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { submitContact, getMessages, markAsRead, deleteMessage };
