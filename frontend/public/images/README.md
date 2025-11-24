# Images Folder

This folder contains static images for the SeAI application.

## Usage

Place your image files here. They will be accessible via:
```
/images/your-image-name.png
```

## Recommended Images

### 1. Logo / Icon
- **Filename**: `logo.png` or `logo.svg`
- **Size**: 128x128px or 256x256px
- **Usage**: Application logo in header

### 2. Background Images (Optional)
- **Filename**: `background.png` or `pattern.png`
- **Usage**: Optional background patterns

### 3. Screenshots
- **Filename**: `screenshot-embed.png`, `screenshot-verify.png`
- **Usage**: Documentation and README

### 4. Feature Icons (Optional)
- **Filenames**: `icon-encryption.png`, `icon-steganography.png`, etc.
- **Size**: 64x64px or 128x128px
- **Usage**: Feature cards in Info panel

## Supported Formats
- PNG (recommended for logos and icons)
- JPG/JPEG (for photos)
- SVG (for scalable graphics)
- WebP (for optimized web images)

## How to Use in Code

In React components:
```javascript
<img src="/images/logo.png" alt="SeAI Logo" />
```

In CSS:
```css
background-image: url('/images/background.png');
```
