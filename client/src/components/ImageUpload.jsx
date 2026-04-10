import { useState, useEffect } from 'react';

export default function ImageUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  // Validation function
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Please select an image file (JPEG, PNG, WebP, or GIF)');
      return false;
    }

    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File size must be under 5MB. Your file is ${fileSizeMB}MB`);
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError('');
      return;
    }

    // Validate the file
    if (!validateFile(file)) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Clear previous error and set new file
    setError('');
    setSelectedFile(file);

    // Revoke previous blob URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create new blob URL for preview
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
  };

  // Cleanup blob URLs on unmount or when preview URL changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file before uploading');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    // Pass FormData to parent component
    onUpload(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="image-upload-form">
      <div className="file-input-wrapper">
        <label htmlFor="file-input" className="file-input-label">
          Select Image
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && !error && (
        <div className="preview-container">
          <img
            src={previewUrl}
            alt="Preview"
            className="preview-image"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        type="submit"
        disabled={!selectedFile || !!error}
        className="upload-button"
      >
        Upload Image
      </button>
    </form>
  );
}
