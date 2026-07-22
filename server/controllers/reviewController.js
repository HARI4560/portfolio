import ReviewToken from '../models/ReviewToken.js';
import Review from '../models/Review.js';
import Project from '../models/Project.js';
import { generateToken } from '../utils/tokenGenerator.js';
import { sendReviewEmail } from '../utils/sendEmail.js';

// @desc    Send review token to client (creates token + sends email)
// @route   POST /api/reviews/send-token
// @access  Private (Admin)
const sendReviewToken = async (req, res) => {
  try {
    const { projectId, clientEmail, clientName } = req.body;

    if (!projectId || !clientEmail || !clientName) {
      return res.status(400).json({ message: 'Project, client email, and client name are required' });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Generate secure token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days

    // Save token to database
    const reviewToken = await ReviewToken.create({
      token,
      projectId,
      clientEmail,
      clientName,
      expiresAt,
    });

    // Build review link
    const reviewLink = `${process.env.CLIENT_URL}/review/${token}`;

    // Send email
    await sendReviewEmail({
      clientEmail,
      clientName,
      projectTitle: project.title,
      reviewLink,
      expiresAt,
    });

    res.status(201).json({
      message: `Review link sent to ${clientEmail}`,
      tokenId: reviewToken._id,
      expiresAt,
    });
  } catch (error) {
    console.error('Send review token error:', error);
    res.status(500).json({ message: 'Failed to send review request', error: error.message });
  }
};

// @desc    Validate review token (public — called when client opens link)
// @route   GET /api/reviews/validate/:token
// @access  Public
const validateToken = async (req, res) => {
  try {
    const reviewToken = await ReviewToken.findOne({ token: req.params.token })
      .populate('projectId', 'title description thumbnail category');

    if (!reviewToken) {
      return res.status(404).json({ message: 'Invalid review link', valid: false });
    }

    if (reviewToken.used) {
      return res.status(400).json({ message: 'This review link has already been used', valid: false, used: true });
    }

    if (reviewToken.isExpired) {
      return res.status(400).json({ message: 'This review link has expired', valid: false, expired: true });
    }

    res.json({
      valid: true,
      clientName: reviewToken.clientName,
      clientEmail: reviewToken.clientEmail,
      project: reviewToken.projectId,
    });
  } catch (error) {
    console.error('Validate token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit review using token
// @route   POST /api/reviews/submit/:token
// @access  Public
const submitReview = async (req, res) => {
  try {
    const { rating, review, clientCompany } = req.body;

    if (!rating || !review) {
      return res.status(400).json({ message: 'Rating and review are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find and validate token
    const reviewToken = await ReviewToken.findOne({ token: req.params.token });

    if (!reviewToken) {
      return res.status(404).json({ message: 'Invalid review link' });
    }
    if (reviewToken.used) {
      return res.status(400).json({ message: 'This review link has already been used' });
    }
    if (reviewToken.isExpired) {
      return res.status(400).json({ message: 'This review link has expired' });
    }

    // Create review
    const newReview = await Review.create({
      projectId: reviewToken.projectId,
      clientName: reviewToken.clientName,
      clientEmail: reviewToken.clientEmail,
      clientCompany,
      rating: parseInt(rating),
      review,
      tokenId: reviewToken._id,
    });

    // Mark token as used
    reviewToken.used = true;
    await reviewToken.save();

    // Update project average rating
    const allReviews = await Review.find({ projectId: reviewToken.projectId });
    const totalReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await Project.findByIdAndUpdate(reviewToken.projectId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews,
    });

    res.status(201).json({
      message: 'Thank you for your review!',
      review: newReview,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reviews for a project (public)
// @route   GET /api/reviews/project/:projectId
// @access  Public
const getProjectReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 })
      .select('-clientEmail -tokenId');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all review tokens (admin view)
// @route   GET /api/reviews/tokens
// @access  Private (Admin)
const getAllTokens = async (req, res) => {
  try {
    const tokens = await ReviewToken.find()
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    res.json(tokens);
  } catch (error) {
    console.error('getAllTokens error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { sendReviewToken, validateToken, submitReview, getProjectReviews, getAllTokens };
