import Profile from '../models/Profile.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import logger from '../utils/logger.js';

// @desc    Get profile (public)
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private (Admin)
const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    const {
      name, title, bio, heroTagline, heroSubtitle,
      skills, experience, education, socialLinks,
    } = req.body;

    if (name) profile.name = name;
    if (title) profile.title = title;
    if (bio) profile.bio = bio;
    if (heroTagline) profile.heroTagline = heroTagline;
    if (heroSubtitle) profile.heroSubtitle = heroSubtitle;
    if (skills) profile.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    if (experience) profile.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
    if (education) profile.education = typeof education === 'string' ? JSON.parse(education) : education;
    if (socialLinks) profile.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;

    // Handle resume upload
    if (req.files?.resume?.[0]) {
      if (profile.resumeFile?.publicId) {
        // Try deleting as both raw and image just in case it was uploaded differently before
        await deleteFromCloudinary(profile.resumeFile.publicId, 'raw');
        await deleteFromCloudinary(profile.resumeFile.publicId, 'image');
      }
      profile.resumeFile = await uploadToCloudinary(
        req.files.resume[0].buffer, 
        'portfolio/resume', 
        'auto', 
        req.files.resume[0].originalname
      );
    }

    // Handle avatar upload
    if (req.files?.avatar?.[0]) {
      if (profile.avatar?.publicId) {
        await deleteFromCloudinary(profile.avatar.publicId);
      }
      profile.avatar = await uploadToCloudinary(req.files.avatar[0].buffer, 'portfolio/avatar');
    }

    await profile.save();

    await logger('PROFILE_UPDATE', req.admin._id, req, {
      updatedFields: Object.keys(req.body)
    });

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getProfile, updateProfile };
