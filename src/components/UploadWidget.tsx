import React, { useState, useEffect } from 'react';
import { Upload, Music, Image, Check, X, Trash2 } from 'lucide-react';

interface UploadWidgetProps {
  onMainPhotoUpload: (url: string) => void;
  onMusicUpload: (url: string) => void;
  onBridePhotoUpload: (url: string) => void;
  onGroomPhotoUpload: (url: string) => void;
  onGalleryUpload: (url: string) => void;
  onRemoveGalleryPhoto: (index: number) => void;
  onComplete: () => void;
  setIsUploading: (state: boolean) => void;
  isUploading: boolean;
  mainPhoto: string;
  musicFile: string;
  bridePhoto: string;
  groomPhoto: string;
  galleryPhotos: string[];
}

const UploadWidget: React.FC<UploadWidgetProps> = ({
  onMainPhotoUpload,
  onMusicUpload,
  onBridePhotoUpload,
  onGroomPhotoUpload,
  onGalleryUpload,
  onRemoveGalleryPhoto,
  onComplete,
  setIsUploading,
  isUploading,
  mainPhoto,
  musicFile,
  bridePhoto,
  groomPhoto,
  galleryPhotos
}) => {
  const [uploadMainPhotoWidget, setUploadMainPhotoWidget] = useState<any>(null);
  const [uploadMusicWidget, setUploadMusicWidget] = useState<any>(null);
  const [uploadBridePhotoWidget, setUploadBridePhotoWidget] = useState<any>(null);
  const [uploadGroomPhotoWidget, setUploadGroomPhotoWidget] = useState<any>(null);
  const [uploadGalleryWidget, setUploadGalleryWidget] = useState<any>(null);

  const createUploadWidget = (callback: (url: string) => void, resourceType: string = 'image', allowedFormats?: string[]) => {
    if (!window.cloudinary) return null;
    
    const options: any = {
      cloudName: 'dzwdwkiw0',
      uploadPreset: 'ml_default',
      sources: ['local', 'url', 'camera'],
      maxFiles: 1,
      maxFileSize: resourceType === 'auto' ? 10000000 : 5000000, // 10MB for audio, 5MB for images
      resourceType: resourceType
    };
    
    if (allowedFormats) {
      options.allowedFormats = allowedFormats;
    }
    
    return window.cloudinary.createUploadWidget(
      options,
      (error: any, result: any) => {
        if (!error && result) {
          if (result.event === 'success') {
            callback(result.info.secure_url);
            setIsUploading(false);
          } else if (result.event === 'close' || result.event === 'abort') {
            // Handle widget close/cancel event
            setIsUploading(false);
          }
        }
        if (error) {
          console.error('Upload error:', error);
          setIsUploading(false);
        }
      }
    );
  };

  useEffect(() => {
    // Initialize all upload widgets
    setUploadMainPhotoWidget(createUploadWidget(onMainPhotoUpload));
    setUploadMusicWidget(createUploadWidget(onMusicUpload, 'auto', ['mp3', 'wav', 'ogg']));
    setUploadBridePhotoWidget(createUploadWidget(onBridePhotoUpload));
    setUploadGroomPhotoWidget(createUploadWidget(onGroomPhotoUpload));
    setUploadGalleryWidget(createUploadWidget(onGalleryUpload));
  }, [onMainPhotoUpload, onMusicUpload, onBridePhotoUpload, onGroomPhotoUpload, onGalleryUpload, setIsUploading]);

  const handleMainPhotoUpload = () => {
    if (uploadMainPhotoWidget) {
      setIsUploading(true);
      uploadMainPhotoWidget.open();
    }
  };

  const handleMusicUpload = () => {
    if (uploadMusicWidget) {
      setIsUploading(true);
      uploadMusicWidget.open();
    }
  };

  const handleBridePhotoUpload = () => {
    if (uploadBridePhotoWidget) {
      setIsUploading(true);
      uploadBridePhotoWidget.open();
    }
  };

  const handleGroomPhotoUpload = () => {
    if (uploadGroomPhotoWidget) {
      setIsUploading(true);
      uploadGroomPhotoWidget.open();
    }
  };

  const handleGalleryUpload = () => {
    if (uploadGalleryWidget) {
      setIsUploading(true);
      uploadGalleryWidget.open();
    }
  };

  // Functions to remove uploaded files
  const handleRemoveMainPhoto = () => {
    onMainPhotoUpload('');
  };

  const handleRemoveMusicFile = () => {
    onMusicUpload('');
  };

  const handleRemoveBridePhoto = () => {
    onBridePhotoUpload('');
  };

  const handleRemoveGroomPhoto = () => {
    onGroomPhotoUpload('');
  };

  const getMusicFileName = (url: string) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      return fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
    } catch (e) {
      return 'Music file';
    }
  };

  const isCompleteUpload = () => {
    return mainPhoto && bridePhoto && groomPhoto;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload Media</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Required Uploads</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Cover Photo */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Cover Photo <span className="text-red-500">*</span></h4>
            
            {mainPhoto ? (
              <div className="relative">
                <img 
                  src={mainPhoto} 
                  alt="Cover" 
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="mt-2 text-center text-green-600 text-sm flex items-center justify-center">
                  <Check className="w-4 h-4 mr-1" /> Uploaded successfully
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleMainPhotoUpload}
                    disabled={isUploading}
                    className="flex-1 py-1 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200 transition flex items-center justify-center"
                  >
                    <Upload className="w-3 h-3 mr-1" /> Replace
                  </button>
                  <button
                    onClick={handleRemoveMainPhoto}
                    disabled={isUploading}
                    className="py-1 px-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleMainPhotoUpload}
                disabled={isUploading}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              >
                <Upload className="w-8 h-8 mb-2" />
                <span>Upload Cover Photo</span>
                <span className="text-xs mt-1">Recommended: 1200 x 800 px</span>
              </button>
            )}
          </div>
          
          {/* Bride Photo */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Bride Photo <span className="text-red-500">*</span></h4>
            
            {bridePhoto ? (
              <div className="relative">
                <img 
                  src={bridePhoto} 
                  alt="Bride" 
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="mt-2 text-center text-green-600 text-sm flex items-center justify-center">
                  <Check className="w-4 h-4 mr-1" /> Uploaded successfully
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleBridePhotoUpload}
                    disabled={isUploading}
                    className="flex-1 py-1 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200 transition flex items-center justify-center"
                  >
                    <Upload className="w-3 h-3 mr-1" /> Replace
                  </button>
                  <button
                    onClick={handleRemoveBridePhoto}
                    disabled={isUploading}
                    className="py-1 px-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleBridePhotoUpload}
                disabled={isUploading}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              >
                <Upload className="w-8 h-8 mb-2" />
                <span>Upload Bride Photo</span>
                <span className="text-xs mt-1">Recommended: Square format</span>
              </button>
            )}
          </div>
          
          {/* Groom Photo */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Groom Photo <span className="text-red-500">*</span></h4>
            
            {groomPhoto ? (
              <div className="relative">
                <img 
                  src={groomPhoto} 
                  alt="Groom" 
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="mt-2 text-center text-green-600 text-sm flex items-center justify-center">
                  <Check className="w-4 h-4 mr-1" /> Uploaded successfully
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleGroomPhotoUpload}
                    disabled={isUploading}
                    className="flex-1 py-1 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200 transition flex items-center justify-center"
                  >
                    <Upload className="w-3 h-3 mr-1" /> Replace
                  </button>
                  <button
                    onClick={handleRemoveGroomPhoto}
                    disabled={isUploading}
                    className="py-1 px-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGroomPhotoUpload}
                disabled={isUploading}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              >
                <Upload className="w-8 h-8 mb-2" />
                <span>Upload Groom Photo</span>
                <span className="text-xs mt-1">Recommended: Square format</span>
              </button>
            )}
          </div>
          
          {/* Background Music */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Background Music (Optional)</h4>
            
            {musicFile ? (
              <div className="relative h-40 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                <Music className="w-10 h-10 text-blue-500 mb-2" />
                <span className="text-gray-700 font-medium text-sm text-center">
                  {getMusicFileName(musicFile)}
                </span>
                <div className="mt-2 flex space-x-2 w-full">
                  <button
                    onClick={handleMusicUpload}
                    disabled={isUploading}
                    className="flex-1 py-1 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200 transition flex items-center justify-center"
                  >
                    <Upload className="w-3 h-3 mr-1" /> Replace
                  </button>
                  <button
                    onClick={handleRemoveMusicFile}
                    disabled={isUploading}
                    className="py-1 px-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleMusicUpload}
                disabled={isUploading}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              >
                <Music className="w-8 h-8 mb-2" />
                <span>Upload Background Music</span>
                <span className="text-xs mt-1">MP3, WAV (Max 10MB)</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Gallery Photos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Gallery Photos (Optional)</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryPhotos.map((photo, index) => (
            <div key={index} className="relative group">
              <img 
                src={photo} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => onRemoveGalleryPhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isUploading}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {galleryPhotos.length < 8 && (
            <button
              onClick={handleGalleryUpload}
              disabled={isUploading}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition"
            >
              <Image className="w-6 h-6 mb-1" />
              <span className="text-xs">Add Photo</span>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">You can upload up to 8 gallery photos.</p>
      </div>
      
      <div className="text-center">
        <button
          onClick={onComplete}
          disabled={!isCompleteUpload() || isUploading}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            isCompleteUpload() && !isUploading
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Continue'}
        </button>
        {!isCompleteUpload() && (
          <p className="text-sm text-red-500 mt-2">Please upload all required photos.</p>
        )}
      </div>
    </div>
  );
};

// Add Window type definition for Cloudinary
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: any,
        callback: (error: any, result: any) => void
      ) => any;
    };
  }
}

export default UploadWidget;