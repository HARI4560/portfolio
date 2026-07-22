import Project from '../models/Project.js';
import Review from '../models/Review.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import logger from '../utils/logger.js';

// @desc    Get all projects (public)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single project with reviews (public)
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const reviews = await Review.find({ projectId: project._id })
      .sort({ createdAt: -1 })
      .select('-clientEmail -tokenId');

    res.json({ project, reviews });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
  try {
    const { title, description, shortDescription, techStack, liveUrl, githubUrl, category, featured, order } = req.body;

    const projectData = {
      title,
      description,
      shortDescription,
      techStack: typeof techStack === 'string' ? JSON.parse(techStack) : techStack,
      liveUrl,
      githubUrl,
      category,
      featured: featured === 'true' || featured === true,
      order: parseInt(order) || 0,
    };

    // Upload thumbnail
    if (req.files?.thumbnail?.[0]) {
      const result = await uploadToCloudinary(req.files.thumbnail[0].buffer, 'portfolio/projects');
      projectData.thumbnail = result;
    }

    // Upload multiple images
    if (req.files?.images?.length) {
      const imagePromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer, 'portfolio/projects')
      );
      projectData.images = await Promise.all(imagePromises);
    }

    const project = await Project.create(projectData);

    await logger('PROJECT_CREATED', req.admin._id, req, {
      projectId: project._id,
      title: project.title
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description, shortDescription, techStack, liveUrl, githubUrl, category, featured, order } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (shortDescription !== undefined) project.shortDescription = shortDescription;
    if (techStack) project.techStack = typeof techStack === 'string' ? JSON.parse(techStack) : techStack;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (category) project.category = category;
    if (featured !== undefined) project.featured = featured === 'true' || featured === true;
    if (order !== undefined) project.order = parseInt(order) || 0;

    // Handle new thumbnail upload
    if (req.files?.thumbnail?.[0]) {
      // Delete old thumbnail from Cloudinary
      if (project.thumbnail?.publicId) {
        await deleteFromCloudinary(project.thumbnail.publicId);
      }
      project.thumbnail = await uploadToCloudinary(req.files.thumbnail[0].buffer, 'portfolio/projects');
    }

    // Handle new images upload
    if (req.files?.images?.length) {
      // Delete old images from Cloudinary
      for (const img of project.images) {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
      }
      const imagePromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer, 'portfolio/projects')
      );
      project.images = await Promise.all(imagePromises);
    }

    await project.save();

    await logger('PROJECT_UPDATED', req.admin._id, req, {
      projectId: project._id,
      title: project.title
    });

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete images from Cloudinary
    if (project.thumbnail?.publicId) {
      await deleteFromCloudinary(project.thumbnail.publicId);
    }
    for (const img of project.images) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }

    // Delete associated reviews
    await Review.deleteMany({ projectId: project._id });

    await project.deleteOne();

    await logger('PROJECT_DELETED', req.admin._id, req, {
      projectId: project._id,
      title: project.title
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all categories
// @route   GET /api/projects/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Project.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getProjects, getProject, createProject, updateProject, deleteProject, getCategories };
