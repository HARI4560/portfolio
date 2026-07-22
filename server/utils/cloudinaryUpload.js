import cloudinary from '../config/cloudinary.js';

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - 'image' or 'raw' (for PDFs)
 * @param {string} originalName - Original file name (optional)
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder = 'portfolio', resourceType = 'image', originalName = '') => {
  return new Promise((resolve, reject) => {
    const isPdf = originalName.toLowerCase().endsWith('.pdf');
    
    // Cloudinary blocks delivery of 'raw' PDFs on free accounts (returns 403 HTML)
    // We must upload PDFs as 'image' with format 'pdf' to bypass this security block
    const actualResourceType = isPdf ? 'image' : resourceType;

    const options = {
      folder,
      resource_type: actualResourceType,
    };

    if (actualResourceType === 'image' && !isPdf) {
      options.quality = 'auto';
      options.fetch_format = 'auto';
    }

    if (isPdf) {
      options.format = 'pdf';
      options.public_id = `${Date.now()}_${originalName.replace(/\.pdf$/i, '').replace(/\s+/g, '_')}`;
    } else if (actualResourceType === 'raw' && originalName) {
      // For raw files, Cloudinary needs the extension in the public_id
      options.public_id = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image' or 'raw'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
