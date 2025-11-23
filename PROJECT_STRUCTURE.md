# SeAI Project Structure

This document provides an overview of the SeAI project structure and file organization.

## Directory Tree

```
SeAl/
├── backend/                    # Flask backend application
│   ├── uploads/               # Temporary storage for uploaded files
│   │   └── .gitkeep
│   ├── output/                # Storage for processed sealed images
│   │   └── .gitkeep
│   ├── app.py                 # Main Flask application and API endpoints
│   ├── encryption.py          # AES-256-GCM encryption module
│   ├── steganography.py       # LSB steganography implementation
│   ├── key_manager.py         # Secure key generation and management
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Example environment configuration
│   └── .env                  # Environment variables (not in git)
│
├── frontend/                  # React frontend application
│   ├── public/               # Static public files
│   │   └── index.html        # HTML entry point
│   ├── src/                  # React source code
│   │   ├── components/       # React components
│   │   │   ├── ImageUploader.js    # Component for embedding SeAl tags
│   │   │   ├── ImageVerifier.js    # Component for verifying SeAl tags
│   │   │   └── InfoPanel.js        # Information and documentation panel
│   │   ├── App.js            # Main application component
│   │   ├── App.css           # Application styles
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   └── package.json          # Node.js dependencies and scripts
│
├── README.md                 # Main project documentation
├── SETUP.md                  # Quick setup guide
├── SECURITY.md               # Security policy and guidelines
├── PROJECT_STRUCTURE.md      # This file
├── LICENSE                   # MIT License
└── .gitignore               # Git ignore rules
```

## File Descriptions

### Backend Files

#### [app.py](backend/app.py)
Main Flask application containing:
- REST API endpoints (`/api/embed`, `/api/verify`, etc.)
- File upload handling
- Error handling and validation
- CORS configuration

**Key Functions:**
- `embed_seal()`: Embeds encrypted SeAl tag in images
- `verify_seal()`: Verifies SeAl tag authenticity
- `download_file()`: Serves processed images
- `health_check()`: API health monitoring

#### [encryption.py](backend/encryption.py)
Cryptographic operations module:
- AES-256-GCM encryption/decryption
- PBKDF2 key derivation
- SeAl tag generation and verification

**Key Class:**
- `SeAlEncryption`: Handles all encryption operations

**Key Methods:**
- `encrypt(data)`: Encrypts data with AES-256-GCM
- `decrypt(data)`: Decrypts and authenticates data
- `generate_seal_tag()`: Creates encrypted SeAl tag
- `verify_seal_tag()`: Validates SeAl tag authenticity

#### [steganography.py](backend/steganography.py)
Image steganography implementation:
- LSB (Least Significant Bit) embedding
- Data extraction from images
- Capacity calculation

**Key Class:**
- `ImageSteganography`: Handles data hiding in images

**Key Methods:**
- `embed_tag()`: Hides encrypted tag in image pixels
- `extract_tag()`: Extracts hidden tag from image
- `calculate_capacity()`: Determines image embedding capacity

#### [key_manager.py](backend/key_manager.py)
Secure key management utilities:
- Cryptographically secure key generation
- Passphrase-based key derivation
- Key validation and storage

**Key Class:**
- `KeyManager`: Key generation and management

**Key Methods:**
- `generate_master_key()`: Creates random secure key
- `generate_key_from_passphrase()`: Derives key from passphrase
- `save_key_to_file()`: Saves key to .env file
- `validate_key()`: Checks key security requirements

**CLI Tool:**
Run `python key_manager.py` for interactive key generation.

#### [requirements.txt](backend/requirements.txt)
Python dependencies:
- `Flask`: Web framework
- `Flask-CORS`: Cross-origin resource sharing
- `Pillow`: Image processing
- `pycryptodome`: Cryptographic operations
- `numpy`: Numerical operations
- `python-dotenv`: Environment variable management

### Frontend Files

#### [App.js](frontend/src/App.js)
Main React application component:
- Tab navigation (Embed, Verify, Info)
- State management
- Component routing

#### [ImageUploader.js](frontend/src/components/ImageUploader.js)
Image upload and SeAl embedding interface:
- Drag-and-drop file upload
- Image preview
- API integration for embedding
- Result display and download

**Key Features:**
- File validation
- Loading states
- Success/error handling
- Download functionality

#### [ImageVerifier.js](frontend/src/components/ImageVerifier.js)
SeAl tag verification interface:
- Image upload for verification
- API integration for verification
- Verification result display

**Key Features:**
- Drag-and-drop support
- Real-time verification
- Visual feedback (verified/not verified)
- Error handling

#### [InfoPanel.js](frontend/src/components/InfoPanel.js)
Information and documentation panel:
- Application overview
- How it works
- Security features
- Technical specifications
- Use cases

#### [App.css](frontend/src/App.css)
Comprehensive styling:
- Gradient backgrounds
- Responsive design
- Animations and transitions
- Component-specific styles
- Mobile-friendly layout

#### [package.json](frontend/package.json)
Node.js configuration:
- React dependencies
- Build scripts
- Development server configuration
- Proxy settings for API calls

### Documentation Files

#### [README.md](README.md)
Main project documentation:
- Project overview
- Installation instructions
- Usage guide
- API documentation
- Security details
- Troubleshooting

#### [SETUP.md](SETUP.md)
Quick start guide:
- Step-by-step setup instructions
- Testing guide
- Common issues
- Quick command reference

#### [SECURITY.md](SECURITY.md)
Security documentation:
- Encryption details
- Security features
- Best practices
- Known limitations
- Compliance considerations
- Security checklist

#### [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
This file - comprehensive project structure documentation.

### Configuration Files

#### [.env](backend/.env)
Environment variables (not committed to git):
```env
SEAL_MASTER_KEY=your-secure-key-here
FLASK_ENV=development
FLASK_DEBUG=True
```

#### [.env.example](backend/.env.example)
Template for environment configuration.

#### [.gitignore](.gitignore)
Specifies intentionally untracked files:
- Python cache and virtual environments
- Node modules
- Environment files
- Upload and output directories
- IDE configurations

## Data Flow

### Embedding Process

```
User (Browser)
    ↓ Upload Image
React Frontend (ImageUploader.js)
    ↓ POST /api/embed
Flask Backend (app.py)
    ↓ Save to uploads/
    ↓ Generate SeAl Tag
Encryption Module (encryption.py)
    ↓ Encrypted Tag
Steganography Module (steganography.py)
    ↓ Embed in Image
    ↓ Save to output/
    ↓ Return Download URL
React Frontend
    ↓ Download Link
User (Browser)
```

### Verification Process

```
User (Browser)
    ↓ Upload Image
React Frontend (ImageVerifier.js)
    ↓ POST /api/verify
Flask Backend (app.py)
    ↓ Save to uploads/
Steganography Module (steganography.py)
    ↓ Extract Tag
Encryption Module (encryption.py)
    ↓ Decrypt & Verify
    ↓ Return Result
React Frontend
    ↓ Display Result
User (Browser)
```

## Technology Stack

### Backend
- **Python 3.8+**: Programming language
- **Flask**: Web framework
- **PyCryptodome**: Cryptography library
- **Pillow**: Image processing
- **NumPy**: Numerical operations

### Frontend
- **React 18.2**: UI framework
- **JavaScript ES6+**: Programming language
- **Axios**: HTTP client
- **CSS3**: Styling with gradients and animations

### Security
- **AES-256-GCM**: Encryption algorithm
- **PBKDF2**: Key derivation function
- **LSB**: Steganography technique

## Development Workflow

1. **Setup**: Follow [SETUP.md](SETUP.md)
2. **Development**:
   - Backend: Edit Python files in `backend/`
   - Frontend: Edit React files in `frontend/src/`
3. **Testing**: Use both tabs to test embed and verify
4. **Deployment**: Follow production security checklist in [SECURITY.md](SECURITY.md)

## Port Configuration

- **Frontend**: http://localhost:3000 (React dev server)
- **Backend**: http://localhost:5000 (Flask server)

The frontend proxies API requests to the backend via the proxy setting in `package.json`.

## Environment Requirements

### Development
- Python 3.8+
- Node.js 14+
- Modern web browser

### Production
- Python 3.8+
- Node.js 14+ (for building)
- Production WSGI server (Gunicorn/uWSGI)
- Reverse proxy (nginx/Apache)
- HTTPS/TLS certificate

## File Size Limits

- **Upload**: 16 MB maximum (configurable in app.py)
- **Minimum**: 100x100 pixels recommended for reliable embedding

## Contributing

When adding new features:
1. Update relevant files in `backend/` or `frontend/src/`
2. Update documentation (README.md, SECURITY.md)
3. Update this structure file if adding new directories
4. Test both embedding and verification workflows
5. Check security implications

## Questions?

Refer to:
- [README.md](README.md) for general information
- [SETUP.md](SETUP.md) for installation help
- [SECURITY.md](SECURITY.md) for security details
