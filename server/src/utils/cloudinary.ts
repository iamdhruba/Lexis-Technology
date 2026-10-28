import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

const enabled = config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret;

if (enabled) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export async function uploadToCloud(filePath: string): Promise<string> {
  if (!enabled) {
    throw new Error('Cloudinary not configured');
  }
  const result = await cloudinary.uploader.upload(filePath, { folder: 'edujung' });
  return result.secure_url;
}

export { cloudinary, enabled as isCloudinaryEnabled };
