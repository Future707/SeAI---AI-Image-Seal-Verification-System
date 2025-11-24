import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageVerifier from './components/ImageVerifier';
import InfoPanel from './components/InfoPanel';

function App() {
  const [activeTab, setActiveTab] = useState('embed');

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          {/* Animated Logo */}
          <img src="/gifs/SeAl.gif" alt="SeAI Logo" className="app-logo" />

          <div className="header-text">
            <h1 className="app-title">SeAI</h1>
            <p className="app-subtitle">AI Image Seal Verification System</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === 'embed' ? 'active' : ''}`}
            onClick={() => setActiveTab('embed')}
          >
            Embed SeAl Tag
          </button>
          <button
            className={`tab-button ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            Verify SeAl Tag
          </button>
          <button
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Information
          </button>
        </div>

        <div className="content">
          {activeTab === 'embed' && <ImageUploader />}
          {activeTab === 'verify' && <ImageVerifier />}
          {activeTab === 'info' && <InfoPanel />}
        </div>
      </div>

      <footer className="App-footer">
        <p>SeAI - Secure AI Image Verification | AES-256 Encryption | LSB Steganography</p>
        <div className="author-info">
          <p>Author: Nuh Hurmanlı <a href="https://github.com/Future707" target="_blank" rel="noopener noreferrer" className="github-link">[Future]</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;
