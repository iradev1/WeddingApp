import React, { useState } from 'react';

interface MediaUploaderProps {
  type: 'image' | 'video';
  currentUrl: string;
  onUrlChange: (url: string) => void;
  note?: string;
  cloudName: string;
  uploadPreset: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  type,
  currentUrl,
  onUrlChange,
  note,
  cloudName,
  uploadPreset,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const resourceType = type === 'image' ? 'image' : 'video';

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onUrlChange(data.secure_url);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Gagal mengunggah. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid =
      (type === 'image' && file.type.startsWith('image/')) ||
      (type === 'video' && (file.type.startsWith('video/') || file.type.startsWith('audio/')));

    if (!isValid) {
      setError(`Silakan pilih file ${type === 'image' ? 'gambar' : 'video/audio'} yang valid`);
      return;
    }

    uploadToCloudinary(file);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition">
      {currentUrl ? (
        <div>
          {type === 'image' ? (
            <img src={currentUrl} alt="Uploaded" className="w-full h-60 object-cover rounded-md mb-3" />
          ) : (
            <video src={currentUrl} controls className="w-full h-60 rounded-md object-contain bg-black mb-3" />
          )}
          <div className="flex justify-between items-center">
            <div
              className="text-sm text-gray-500 truncate max-w-[80%]"
              title={currentUrl.split('/').pop() ?? ''}
            >
              {currentUrl.split('/').pop()}
            </div>
            <button
              onClick={() => onUrlChange('')}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <label className="cursor-pointer block" role="button" aria-busy={uploading} aria-disabled={uploading}>
            <p className="text-gray-700 mb-2 text-sm">
              {uploading ? 'Sedang mengunggah...' : `Upload ${type === 'image' ? 'Foto' : 'Video / Musik'}`}
            </p>
            <input
              type="file"
              accept={type === 'image' ? 'image/*' : 'video/*,audio/*'}
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <div className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition">
              {uploading ? 'Mohon tunggu...' : 'Pilih File'}
            </div>
            {note && <p className="text-xs text-gray-500 mt-2">{note}</p>}
          </label>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
