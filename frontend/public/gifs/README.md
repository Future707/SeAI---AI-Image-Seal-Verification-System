# GIFs Folder

This folder contains animated GIF files for the SeAI application.

## Usage

Place your GIF files here. They will be accessible via:
```
/gifs/your-animation.gif
```

## Recommended GIFs

### 1. Demo Animation
- **Filename**: `demo.gif` or `seai-demo.gif`
- **Purpose**: Show the app in action (embed + verify workflow)
- **Recommended Size**: 800x600px or 1024x768px
- **Duration**: 5-15 seconds

### 2. Loading Animation (Optional)
- **Filename**: `loading.gif` or `spinner.gif`
- **Purpose**: Custom loading animation
- **Size**: 64x64px or 128x128px

### 3. Feature Demonstrations
- **Filenames**: `embed-process.gif`, `verify-process.gif`
- **Purpose**: Step-by-step process demonstrations
- **Usage**: Documentation and tutorials

### 4. Logo Animation (Optional)
- **Filename**: `logo-animated.gif`
- **Purpose**: Animated version of the SeAI logo
- **Size**: 128x128px or 256x256px

## Optimization Tips

1. **File Size**: Keep GIFs under 5MB for faster loading
2. **Colors**: Reduce color palette (128-256 colors) for smaller files
3. **Frame Rate**: 10-15 fps is usually sufficient
4. **Duration**: Keep animations short (5-10 seconds)
5. **Tools**: Use tools like:
   - Photoshop
   - GIMP
   - Online tools: ezgif.com, gifski.app

## How to Use in Code

In React components:
```javascript
<img src="/gifs/demo.gif" alt="SeAI Demo" />
```

In CSS:
```css
background-image: url('/gifs/loading.gif');
```

## Current Usage

Once you add your GIFs, they can be used in:
- README.md (for GitHub)
- Info panel (for demonstrations)
- Loading states
- Welcome screen
