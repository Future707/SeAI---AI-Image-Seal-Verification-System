import React from 'react';

const InfoPanel = () => {
  return (
    <div className="info-container">
      <div className="info-section">
        <h2>About SeAI</h2>
        <p>
          SeAI (Seal AI) is a secure image verification system that allows you to embed
          and verify encrypted tags in images to confirm they are AI-generated. Using
          advanced cryptography and steganography techniques, SeAI ensures that images
          can be authenticated without visible alterations.
        </p>
      </div>

      <div className="info-section">
        <h2>How It Works</h2>
        <p><strong>Embedding Process:</strong></p>
        <ul>
          <li>Upload your image through the web interface</li>
          <li>SeAI generates a unique "SeAl" tag with metadata</li>
          <li>The tag is encrypted using AES-256-GCM encryption</li>
          <li>The encrypted tag is hidden in the image using LSB steganography</li>
          <li>Download the sealed image (visually identical to the original)</li>
        </ul>

        <p><strong>Verification Process:</strong></p>
        <ul>
          <li>Upload an image to verify</li>
          <li>SeAI extracts the hidden encrypted tag from the image</li>
          <li>The tag is decrypted and verified</li>
          <li>Results confirm whether the image is AI-generated</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Security Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>AES-256 Encryption</h3>
            <p>Military-grade encryption using Galois/Counter Mode with authentication</p>
          </div>
          <div className="feature-card">
            <h3>LSB Steganography</h3>
            <p>Invisible embedding using Least Significant Bit pixel manipulation</p>
          </div>
          <div className="feature-card">
            <h3>Tamper Detection</h3>
            <p>Authenticated encryption prevents undetected modifications</p>
          </div>
          <div className="feature-card">
            <h3>Key Derivation</h3>
            <p>PBKDF2 with 100,000 iterations for secure key generation</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Technical Specifications</h2>
        <ul>
          <li><strong>Encryption Algorithm:</strong> AES-256-GCM (Advanced Encryption Standard)</li>
          <li><strong>Key Derivation:</strong> PBKDF2 with SHA-256</li>
          <li><strong>Steganography Method:</strong> LSB (Least Significant Bit) Technique</li>
          <li><strong>Supported Formats:</strong> PNG, JPG, JPEG, BMP</li>
          <li><strong>Output Format:</strong> PNG (lossless compression)</li>
          <li><strong>Maximum File Size:</strong> 16 MB</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Use Cases</h2>
        <ul>
          <li><strong>AI Content Verification:</strong> Prove that images are AI-generated</li>
          <li><strong>Digital Rights Management:</strong> Protect and authenticate digital artwork</li>
          <li><strong>Content Authenticity:</strong> Verify the origin and integrity of images</li>
          <li><strong>Watermarking:</strong> Invisible watermarking for copyright protection</li>
          <li><strong>Research:</strong> Track and verify AI-generated content in academic settings</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Important Notes</h2>
        <ul>
          <li>The SeAl tag is invisible and does not alter the visual appearance of images</li>
          <li>Images are saved as PNG to prevent compression artifacts that could damage the tag</li>
          <li>The embedded tag survives lossless operations but may be lost with heavy compression</li>
          <li>Keep your master encryption key secure - it's required for verification</li>
          <li>Images should be at least 100x100 pixels for reliable tag embedding</li>
        </ul>
      </div>

      <div className="info-section" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>
          SeAI v1.0.0 | Built with Flask, React, and cutting-edge cryptography
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;
