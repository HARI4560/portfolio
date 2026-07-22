import { Router } from 'express';
const router = Router();
import { submitContact, getMessages, markAsRead, deleteMessage } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

// Public
router.post('/', submitContact);

// Admin
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

export default router;
