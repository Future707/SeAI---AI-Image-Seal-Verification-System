import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageVerifier = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
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

  const handleVerify = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult({
        verified: response.data.verified,
        message: response.data.message,
        details: response.data.details,
      });
    } catch (error) {
      setResult({
        verified: false,
        message: 'Verification Failed',
        details: error.response?.data?.error || 'Failed to verify image',
      });
    } finally {
      setLoading(false);
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
    <div className="verify-container">
      <h2>Verify SeAl Tag</h2>
      <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>
        Upload an image to verify if it contains a valid AI-generated SeAl tag
      </p>

      {!selectedFile && !loading && !result && (
        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''}`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">🔍</div>
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
            <button className="btn btn-primary" onClick={handleVerify}>
              Verify SeAl Tag
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
          <p>Verifying SeAl tag...</p>
        </div>
      )}

      {result && (
        <div className={`result-container ${result.verified ? 'result-success' : 'result-error'}`}>
          <div className="result-icon">{result.verified ? '✓' : '✗'}</div>
          <h3 className="result-title">{result.message}</h3>
          <p className="result-message">{result.details}</p>
          {result.verified && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(76, 175, 80, 0.05)', borderRadius: '8px' }}>
              <p style={{ color: '#4caf50', fontWeight: '600', margin: 0 }}>
                This image has been verified as AI-generated and contains a valid SeAl tag.
              </p>
            </div>
          )}
          {!result.verified && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(244, 67, 54, 0.05)', borderRadius: '8px' }}>
              <p style={{ color: '#f44336', fontWeight: '600', margin: 0 }}>
                No valid SeAl tag detected. This image may not be AI-generated or the tag has been tampered with.
              </p>
            </div>
          )}
          <button className="btn btn-secondary" onClick={handleReset} style={{ marginTop: '1rem' }}>
            Verify Another Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageVerifier;
