import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleEmbed = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    // Start embedding process
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/embed', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult({
        success: true,
        message: response.data.message,
        downloadUrl: response.data.download_url,
        filename: response.data.filename,
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.error || 'Failed to embed SeAl tag',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (result && result.downloadUrl) {
      try {
        // Fetch the file
        const response = await fetch(result.downloadUrl);
        const blob = await response.blob();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename || 'sealed-image.png';

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        alert('Failed to download file. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-container">
      <h2>Embed SeAl Tag in Image</h2>
      <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>
        Upload an image to embed an encrypted AI-generated SeAl tag
      </p>

      {showToast && (
        <div className="toast-notification">
          <div className="toast-icon">🔐</div>
          <div className="toast-content">
            <div className="toast-title">Encryption Applied</div>
            <div className="toast-message">
              Your image is being sealed with AES-256-GCM encryption and LSB steganography
            </div>
          </div>
        </div>
      )}

      {!selectedFile && !loading && !result && (
        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''}`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📁</div>
          <p className="upload-text">Click or drag image here</p>
          <p className="upload-hint">Supported formats: PNG, JPG, JPEG, BMP (Max 16MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            className="file-input"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {selectedFile && !loading && !result && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
          <div className="file-info">
            <strong>File:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </div>
          <div className="button-group">
            <button className="btn btn-primary" onClick={handleEmbed}>
              Embed SeAl Tag
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Choose Different Image
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Embedding SeAl tag in your image...</p>
        </div>
      )}

      {result && (
        <div className={`result-container ${result.success ? 'result-success' : 'result-error'}`}>
          <div className="result-icon">{result.success ? '✓' : '✗'}</div>
          <h3 className="result-title">
            {result.success ? 'Success!' : 'Error'}
          </h3>
          <p className="result-message">{result.message}</p>
          {result.success && (
            <div className="button-group">
              <button className="btn btn-primary" onClick={handleDownload}>
                Download Sealed Image
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                Embed Another Image
              </button>
            </div>
          )}
          {!result.success && (
            <button className="btn btn-secondary" onClick={handleReset}>
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
