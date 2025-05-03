interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  version: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

export const uploadToCloudinary = async (
  file: File,
  resourceType: 'image' | 'video' | 'auto',
  options?: { [key: string]: string }
): Promise<CloudinaryUploadResponse> => {
  // Replace these values with your Cloudinary credentials
  const cloudName = 'your-cloud-name';
  const uploadPreset = 'wedding_invitation'; // unsigned upload preset

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  // Add any additional options
  if (options) {
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};