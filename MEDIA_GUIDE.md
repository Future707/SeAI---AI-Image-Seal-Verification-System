# Media Files Guide - SeAI

This guide explains how to add your images and GIFs to the SeAI application.

## 📁 Folder Structure

```
frontend/public/
├── images/          # Static images (logos, icons, screenshots)
│   └── README.md    # Usage instructions
├── gifs/            # Animated GIFs (demos, loading animations)
│   └── README.md    # Usage instructions
└── index.html
```

## 🖼️ How to Add Images

### Step 1: Place Your Images

1. **Logo/Icon**: Copy your logo to `frontend/public/images/logo.png`
2. **Other Images**: Place any additional images in `frontend/public/images/`

### Step 2: Enable Logo in Header

Edit `frontend/src/App.js` and uncomment these lines:

```javascript
// Find these lines (around line 16):
{/* <img src="/images/logo.png" alt="SeAI Logo" className="app-logo" /> */}

// Change to:
<img src="/images/logo.png" alt="SeAI Logo" className="app-logo" />
```

### Step 3: Refresh Browser

The logo will appear with a pulsing blue glow effect!

## 🎬 How to Add GIFs

### For Demo GIF in README

1. Place your demo GIF: `frontend/public/gifs/demo.gif`
2. The GitHub README already references it (see line 5 in README.md)

### For Loading Animation

Edit your component and add:

```javascript
<img src="/gifs/loading.gif" alt="Loading..." />
```

## 📋 Recommended Files to Add

### Essential:
- ✅ `frontend/public/images/logo.png` (128x128px) - App logo
- ✅ `frontend/public/gifs/demo.gif` - Demo animation

### Optional:
- `frontend/public/images/icon.png` - App icon
- `frontend/public/images/screenshot-embed.png` - Embed screenshot
- `frontend/public/images/screenshot-verify.png` - Verify screenshot
- `frontend/public/gifs/loading.gif` - Custom loading animation

## 🎨 Logo Specifications

### Recommended Format: PNG with Transparency

**Size Options:**
- Small: 64x64px (for favicon)
- Medium: 128x128px (for header - current)
- Large: 256x256px or 512x512px (for high-res displays)

### Current Logo Styling:
```css
.app-logo {
  width: 80px;           /* Display size */
  height: 80px;
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5)); /* Blue glow */
  animation: pulse 3s ease-in-out infinite; /* Pulsing effect */
}
```

### To Change Logo Size:

Edit `frontend/src/App.css` line 45-47:

```css
.app-logo {
  width: 120px;  /* Change this */
  height: 120px; /* And this */
}
```

## 🎥 GIF Specifications

### Demo GIF (for GitHub README):
- **Size**: 800x600px or 1024x768px
- **Duration**: 5-15 seconds
- **File Size**: Under 5MB
- **Content**: Show embed → download → verify workflow

### Loading GIF:
- **Size**: 64x64px or 128x128px
- **Duration**: 1-3 seconds (looping)
- **File Size**: Under 500KB

## 🔧 Advanced Customization

### Add Background Image

Edit `frontend/src/App.css`:

```css
body {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1b2a 100%),
              url('/images/background.png');
  background-blend-mode: overlay;
}
```

### Add Feature Icons

Edit `frontend/src/components/InfoPanel.js`:

```javascript
<div className="feature-card">
  <img src="/images/icon-encryption.png" alt="Encryption" style={{width: '48px', height: '48px'}} />
  <h3>AES-256 Encryption</h3>
  <p>Military-grade encryption...</p>
</div>
```

## 📝 Example Usage

### In React Components:

```javascript
// Logo in header
<img src="/images/logo.png" alt="Logo" className="app-logo" />

// Demo GIF
<img src="/gifs/demo.gif" alt="Demo" style={{maxWidth: '100%'}} />

// Screenshot
<img src="/images/screenshot.png" alt="Screenshot" />
```

### In CSS:

```css
/* Background image */
.element {
  background-image: url('/images/pattern.png');
}

/* Logo background */
.logo-container {
  background: url('/images/logo.svg') center/contain no-repeat;
}
```

## 🚀 Quick Start Checklist

- [ ] Add logo to `frontend/public/images/logo.png`
- [ ] Uncomment logo line in `frontend/src/App.js` (line 16)
- [ ] Add demo GIF to `frontend/public/gifs/demo.gif` (optional)
- [ ] Refresh browser to see changes
- [ ] Adjust logo size if needed in `App.css`

## 💡 Tips

1. **PNG for logos**: Use PNG with transparency for logos
2. **Optimize GIFs**: Use tools like ezgif.com to reduce file size
3. **Responsive**: Images auto-scale on mobile devices
4. **Blue theme**: Logo glow effect matches the dark blue theme
5. **Performance**: Keep total media files under 10MB

## 🔄 After Adding Media Files

1. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
2. Check browser console for any 404 errors
3. If logo doesn't appear, verify file path is correct
4. The React dev server will auto-reload when you save changes

## 📸 Need Help?

Check the README files in:
- `frontend/public/images/README.md`
- `frontend/public/gifs/README.md`

---

**Current Status:**
- ✅ Folders created
- ✅ Logo placeholder added in code
- ✅ CSS styling ready
- ⏳ Waiting for your images and GIFs!
