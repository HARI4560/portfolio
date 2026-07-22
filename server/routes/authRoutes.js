import express from 'express';
const router = express.Router();
import { login, refreshAccessToken, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
