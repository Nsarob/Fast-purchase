import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

/**
 * Upload image to Cloudinary
 * @param file - Multer file object
 * @param folder - Cloudinary folder name
 * @returns Promise with upload result containing secure_url
 */
export const uploadImage = (
  file: Express.Multer.File,
  folder: string = 'products'
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // Max dimensions
          { quality: 'auto' }, // Auto quality optimization
          { fetch_format: 'auto' }, // Auto format (WebP when supported)
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = Readable.from(file.buffer);
    bufferStream.pipe(uploadStream);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of Multer file objects
 * @param folder - Cloudinary folder name
 * @returns Promise with array of secure URLs
 */
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string = 'products'
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file, folder));
  const results = await Promise.all(uploadPromises);
  return results.map((result) => result.secure_url);
};

/**
 * Delete image from Cloudinary
 * @param imageUrl - Full Cloudinary image URL
 * @returns Promise with deletion result
 */
export const deleteImage = async (imageUrl: string): Promise<any> => {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `products/${filename.split('.')[0]}`;

    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param imageUrls - Array of Cloudinary image URLs
 * @returns Promise with deletion results
 */
export const deleteMultipleImages = async (
  imageUrls: string[]
): Promise<any[]> => {
  const deletePromises = imageUrls.map((url) => deleteImage(url));
  return await Promise.all(deletePromises);
};
