import { Router } from 'express';
const router = Router();
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const profileUpload = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'avatar', maxCount: 1 },
]);

// Public
router.get('/', getProfile);

// Admin
router.put('/', protect, profileUpload, updateProfile);

export default router;
