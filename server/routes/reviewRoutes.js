import { Router } from 'express';
const router = Router();
import { sendReviewToken, validateToken, submitReview, getProjectReviews, getAllTokens } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

// Admin routes
router.post('/send-token', protect, sendReviewToken);
router.get('/tokens', protect, getAllTokens);

// Public routes
router.get('/validate/:token', validateToken);
router.post('/submit/:token', submitReview);
router.get('/project/:projectId', getProjectReviews);

export default router;
