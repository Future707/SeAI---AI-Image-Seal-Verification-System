# SeAI - AI Image Seal Verification System

![SeAI Banner](https://img.shields.io/badge/SeAI-v1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Python](https://img.shields.io/badge/python-3.8+-blue) ![React](https://img.shields.io/badge/react-18.2+-blue)

<img src="https://github.com/Future707/Inventory/blob/main/Images/SeAl.gif" width="128" height="128">
![SeAl](https://github.com/Future707/Inventory/blob/main/Images/SeAl.gif)

## Overview

**SeAI (Seal AI)** is a secure web-based application that allows users to embed encrypted "SeAl" tags in images to verify that they are AI-generated. The application uses advanced cryptography (AES-256) and steganography techniques to hide authentication tags within image pixels without altering their visual appearance.

### Key Features

- **AES-256 Encryption**: Military-grade encryption using Galois/Counter Mode (GCM) with authentication
- **LSB Steganography**: Invisible embedding using Least Significant Bit pixel manipulation
- **Tamper Detection**: Authenticated encryption prevents undetected modifications
- **Web Interface**: Easy-to-use React frontend for uploading and verifying images
- **Secure Key Management**: PBKDF2 key derivation with customizable master keys
- **Multiple Format Support**: PNG, JPG, JPEG, BMP input formats

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Usage Guide](#usage-guide)
- [Security](#security)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn package manager

### Backend Setup

1. **Clone the repository and navigate to the backend directory:**

```bash
cd backend
```

2. **Create a virtual environment (recommended):**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

4. **Generate a secure master key:**

```bash
python key_manager.py
```

Follow the prompts to generate a new master key and save it to the `.env` file.

5. **Verify configuration:**

Make sure the `.env` file exists with your secure master key:

```env
SEAL_MASTER_KEY=your-generated-secure-key-here
FLASK_ENV=development
FLASK_DEBUG=True
```

### Frontend Setup

1. **Navigate to the frontend directory:**

```bash
cd ../frontend
```

2. **Install Node.js dependencies:**

```bash
npm install
```

## Quick Start

### Running the Application

You'll need two terminal windows - one for the backend and one for the frontend.

**Terminal 1 - Backend:**

```bash
cd backend
python app.py
```

The Flask backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

The React frontend will start on `http://localhost:3000` and automatically open in your browser.

### First Steps

1. Navigate to `http://localhost:3000` in your browser
2. Use the **Embed SeAl Tag** tab to upload an image
3. Click "Embed SeAl Tag" and download the sealed image
4. Switch to **Verify SeAl Tag** tab
5. Upload the sealed image to verify it contains a valid AI-generated tag

## Architecture

### System Overview

```
┌─────────────────┐
│  React Frontend │ (Port 3000)
│   - Image Upload│
│   - Verification│
│   - Results UI  │
└────────┬────────┘
         │ HTTP/REST API
         ▼
┌─────────────────┐
│  Flask Backend  │ (Port 5000)
│   - API Routes  │
│   - File Handling
└────────┬────────┘
         │
    ┌────┴────┬───────────┐
    ▼         ▼           ▼
┌─────────┐ ┌──────┐ ┌──────────┐
│Encryption│ │Stego │ │   Key    │
│ Module  │ │Module│ │ Manager  │
│ AES-256 │ │ LSB  │ │ PBKDF2   │
└─────────┘ └──────┘ └──────────┘
```

### Backend Components

1. **app.py**: Flask application with REST API endpoints
2. **encryption.py**: AES-256-GCM encryption/decryption module
3. **steganography.py**: LSB steganography for embedding/extracting tags
4. **key_manager.py**: Secure key generation and management

### Frontend Components

1. **App.js**: Main application component with tab navigation
2. **ImageUploader.js**: Component for embedding SeAl tags
3. **ImageVerifier.js**: Component for verifying SeAl tags
4. **InfoPanel.js**: Information and documentation panel

## Usage Guide

### Embedding a SeAl Tag

1. **Select Image**: Click or drag an image to the upload area
   - Supported formats: PNG, JPG, JPEG, BMP
   - Maximum size: 16 MB
   - Minimum recommended size: 100x100 pixels

2. **Embed Tag**: Click the "Embed SeAl Tag" button
   - The application encrypts the SeAl tag using AES-256
   - The encrypted tag is hidden in the image using LSB steganography
   - A magic header "SEAI" is added for identification

3. **Download**: Save the sealed image
   - The output is a PNG file to preserve the embedded tag
   - The image is visually identical to the original
   - The tag is invisible and embedded in pixel data

### Verifying a SeAl Tag

1. **Upload Image**: Upload the image you want to verify

2. **Verify**: Click the "Verify SeAl Tag" button
   - The application extracts data from the image's pixels
   - The tag is decrypted and validated
   - Results show whether the image is AI-generated

3. **Results**:
   - ✓ **Verified**: "SeAl tag verified!" - Valid AI-generated image
   - ✗ **Not Verified**: "This image was not generated by AI" - No valid tag found

## Security

### Encryption Details

- **Algorithm**: AES-256 in Galois/Counter Mode (GCM)
- **Key Derivation**: PBKDF2 with SHA-256 (100,000 iterations)
- **Authentication**: Built-in authentication tag prevents tampering
- **Random Salt**: Unique salt for each encryption operation
- **Nonce**: Unique nonce (number used once) for each encryption

### Steganography Details

- **Method**: Least Significant Bit (LSB) replacement
- **Capacity**: Depends on image size (1 bit per pixel channel)
- **Detection**: Magic header "SEAI" for identification
- **Robustness**: Survives lossless operations, may be lost with heavy compression

### Security Best Practices

1. **Master Key Protection**:
   - Use a strong, random master key (64+ characters)
   - Never commit `.env` file to version control
   - Store keys securely using environment variables or key vaults
   - Rotate keys periodically in production

2. **Image Handling**:
   - Validate file types and sizes
   - Store uploaded files temporarily only
   - Clean up files after processing
   - Use secure file permissions

3. **Production Deployment**:
   - Use HTTPS for all communications
   - Implement rate limiting
   - Add authentication/authorization
   - Enable logging and monitoring
   - Use a production-grade WSGI server (Gunicorn, uWSGI)

## API Documentation

### Endpoints

#### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "SeAI API",
  "timestamp": "2024-01-01T00:00:00.000000"
}
```

#### Embed SeAl Tag

```
POST /api/embed
Content-Type: multipart/form-data
```

**Parameters:**
- `image`: Image file (PNG, JPG, JPEG, BMP)

**Response:**
```json
{
  "success": true,
  "message": "SeAl tag successfully embedded",
  "filename": "uuid_sealed.png",
  "download_url": "/api/download/uuid_sealed.png"
}
```

#### Verify SeAl Tag

```
POST /api/verify
Content-Type: multipart/form-data
```

**Parameters:**
- `image`: Image file to verify

**Response (Verified):**
```json
{
  "verified": true,
  "message": "SeAl tag verified!",
  "details": "This image contains a valid AI-generated SeAl tag."
}
```

**Response (Not Verified):**
```json
{
  "verified": false,
  "message": "This image was not generated by AI.",
  "details": "No valid SeAl tag found in the image."
}
```

#### Download File

```
GET /api/download/<filename>
```

Downloads the processed image file.

#### System Info

```
GET /api/info
```

**Response:**
```json
{
  "application": "SeAI - AI Image Seal Verification System",
  "version": "1.0.0",
  "encryption": "AES-256-GCM",
  "steganography": "LSB (Least Significant Bit)",
  "supported_formats": ["png", "jpg", "jpeg", "bmp"],
  "max_file_size_mb": 16
}
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Master encryption key (required)
SEAL_MASTER_KEY=your-secure-master-key-here

# Flask configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

### Application Settings

Edit [backend/app.py](backend/app.py) to customize:

- `UPLOAD_FOLDER`: Directory for temporary uploads
- `OUTPUT_FOLDER`: Directory for processed images
- `ALLOWED_EXTENSIONS`: Supported image formats
- `MAX_FILE_SIZE`: Maximum upload size (default: 16MB)

## Troubleshooting

### Common Issues

**1. "Image too small for embedding SeAl tag"**
- The image doesn't have enough pixels to hide the encrypted tag
- Use a larger image (minimum 100x100 pixels recommended)

**2. "No valid SeAl tag found"**
- The image doesn't contain a SeAl tag
- The image may have been compressed or modified
- The magic header "SEAI" is missing

**3. "Decryption failed"**
- The encrypted tag has been tampered with
- Different master key is being used for verification
- Image compression damaged the embedded data

**4. "Module not found" errors**
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Activate your virtual environment

**5. Frontend can't connect to backend**
- Ensure Flask backend is running on port 5000
- Check the proxy setting in `frontend/package.json`
- Verify CORS is enabled in Flask

### Debug Mode

Enable detailed logging in Flask:

```python
# In app.py
app.run(debug=True, host='0.0.0.0', port=5000)
```

## Technical Details

### Image Capacity Calculation

The number of characters that can be hidden in an image:

```
Capacity = (Width × Height × 3 - 32) / 8
```

Where:
- Width × Height × 3 = total pixel channels (RGB)
- 32 bits reserved for length header
- 8 bits per character

Example: A 500×500 pixel image can hide approximately 93,746 characters.

### Tag Structure

```
[Length Header: 32 bits][Magic: "SEAI"][Encrypted Tag: Variable]
```

### Encrypted Tag Format

```
[Salt: 16 bytes][Nonce: 16 bytes][Auth Tag: 16 bytes][Ciphertext: Variable]
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **PyCryptodome**: For AES encryption implementation
- **Pillow**: For image processing capabilities
- **Flask**: For the backend web framework
- **React**: For the frontend user interface

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**⚠️ Important Security Notice**: This is a demonstration application. For production use, implement additional security measures including:
- User authentication and authorization
- Rate limiting and abuse prevention
- Secure key storage (e.g., AWS KMS, Azure Key Vault)
- HTTPS/TLS encryption for data in transit
- Regular security audits
- Compliance with relevant data protection regulations

---

**Made with ❤️ for secure AI content verification**
