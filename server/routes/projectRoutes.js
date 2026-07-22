import { Router } from 'express';
const router = Router();
import { getProjects, getProject, createProject, updateProject, deleteProject, getCategories } from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const uploadProjectFiles = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

// Public routes
router.get('/', getProjects);
router.get('/categories', getCategories);
router.get('/:id', getProject);

// Admin routes
router.post('/', protect, uploadProjectFiles, createProject);
router.put('/:id', protect, uploadProjectFiles, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
