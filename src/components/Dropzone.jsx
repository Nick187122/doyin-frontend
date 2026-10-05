import { useState, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import './Dropzone.css';

const Dropzone = ({ onFileSelect, accept = 'image/*', maxSizeMB = 4, currentPreview }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentPreview || null);

  const validateFile = useCallback((file) => {
    if (!file) return false;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be under ${maxSizeMB}MB.`);
      return false;
    }
    setError('');
    return true;
  }, [maxSizeMB]);

  const handleFile = useCallback((file) => {
    if (!validateFile(file)) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClear = useCallback(() => {
    setPreview(null);
    setError('');
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div
      className={`dropzone ${isDragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {preview ? (
        <div className="dropzone-preview">
          <img src={preview} alt="Upload preview" />
          <button type="button" className="dropzone-clear" onClick={handleClear} title="Remove image">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="dropzone-label">
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
          <div className="dropzone-icon">
            {isDragOver ? <Upload size={28} /> : <ImageIcon size={28} />}
          </div>
          <div className="dropzone-text">
            <strong>{isDragOver ? 'Drop image here' : 'Drag & drop or click to upload'}</strong>
            <span>Recommended: 800x800px | JPEG, PNG, WebP | Max {maxSizeMB}MB</span>
          </div>
        </label>
      )}
      {error && <p className="dropzone-error">{error}</p>}
    </div>
  );
};

export default Dropzone;
