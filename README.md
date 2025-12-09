# Durood Sharif with Audio - Web Application

A beautiful, modern web application converted from an Android APK, featuring Islamic prayers (Durood Sharif) with images and audio playback.

## Features

- 📿 **43 Beautiful Images** - High-quality images of Durood Sharif prayers
- 🎵 **43 Audio Files** - Audio recitations for each prayer
- 🖼️ **Image Gallery** - Browse and view images in a beautiful grid layout
- 🎧 **Audio Player** - Full-featured audio player with play/pause, next/previous controls
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Modern UI** - Beautiful, modern interface with smooth animations
- ⌨️ **Keyboard Navigation** - Navigate images with arrow keys

## Project Structure

```
durood/
├── web/                          # Web application
│   ├── index.html               # Main HTML file
│   ├── styles.css               # Styling
│   ├── script.js                # JavaScript functionality
│   └── assets/                  # Assets folder
│       ├── images/              # Screen images (43 images)
│       └── audio/               # Audio files (43+ files)
├── extracted_apk/               # Extracted APK contents
├── extract_apk.py              # APK extraction script
├── ANDROID_COMPATIBILITY_GUIDE.md  # Guide for updating Android version
└── README.md                    # This file
```

## Quick Start

### Option 1: Open Directly in Browser

1. Navigate to the `web` folder
2. Open `index.html` in your web browser
3. That's it! The app is ready to use.

### Option 2: Using a Local Server (Recommended)

For better performance and to avoid CORS issues:

#### Using Python:
```bash
cd web
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

#### Using Node.js:
```bash
cd web
npx http-server -p 8000
```

#### Using PHP:
```bash
cd web
php -S localhost:8000
```

## Usage

### Viewing Images
1. Click on the **Images** tab
2. Browse the gallery of 43 Durood Sharif images
3. Click any image to view it in fullscreen
4. Use arrow keys or navigation buttons to move between images
5. Press `ESC` to close the image viewer

### Playing Audio
1. Click on the **Audio** tab
2. Browse the list of available audio files
3. Click the play button (▶) next to any audio to start playback
4. Use the audio player controls at the bottom:
   - ⏮ Previous audio
   - ▶/⏸ Play/Pause
   - ⏭ Next audio
   - Progress bar to seek through audio

## Features in Detail

### Image Gallery
- Grid layout that adapts to screen size
- Lazy loading for better performance
- Fullscreen modal viewer
- Keyboard navigation (Arrow keys, ESC)
- Image counter showing current position

### Audio Player
- Fixed bottom player that appears when audio is playing
- Progress bar with seeking capability
- Time display (current/total)
- Auto-play next track when current finishes
- Visual indication of currently playing track

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly controls
- Optimized for both portrait and landscape

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Changing Colors
Edit `styles.css` and modify the CSS variables:
```css
:root {
    --primary-color: #2c5f41;      /* Main color */
    --primary-dark: #1e3f2a;       /* Darker shade */
    --primary-light: #3d7a5a;      /* Lighter shade */
    --secondary-color: #d4af37;    /* Accent color */
}
```

### Adding More Content
1. Add images to `web/assets/images/` (name them `screen_44.png`, `screen_45.png`, etc.)
2. Add audio files to `web/assets/audio/` (name them `39.mp3`, `40.mp3`, etc.)
3. Update `CONFIG.totalImages` and `CONFIG.totalAudio` in `script.js`

## Deployment

### Deploy to GitHub Pages
1. Create a GitHub repository
2. Push the `web` folder contents to the repository
3. Enable GitHub Pages in repository settings
4. Your app will be live at `https://yourusername.github.io/repository-name`

### Deploy to Netlify
1. Drag and drop the `web` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your app will be live instantly with a free URL

### Deploy to Vercel
```bash
cd web
vercel
```

## Android APK Update

If you want to update the original Android APK to support newer Android versions, see `ANDROID_COMPATIBILITY_GUIDE.md` for detailed instructions.

## Technical Details

- **Pure JavaScript** - No frameworks required
- **Vanilla CSS** - Modern CSS with flexbox and grid
- **HTML5 Audio API** - For audio playback
- **Responsive Images** - Optimized loading with lazy loading
- **Local Storage Ready** - Can be extended to save preferences

## Future Enhancements

Potential features to add:
- [ ] Search functionality
- [ ] Favorites/Bookmarks
- [ ] Playlist creation
- [ ] Download audio/images
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA) support
- [ ] Offline support with service workers
- [ ] Share functionality

## License

This project is created for educational and personal use. Please respect the original content creators.

## Support

For issues or questions:
1. Check the `ANDROID_COMPATIBILITY_GUIDE.md` for Android-related questions
2. Review the code comments in `script.js` and `styles.css`
3. Ensure all assets are in the correct folders

## Credits

- Original APK: Durood Sharif with Audio
- Web Conversion: Created from extracted APK content
- Design: Modern, responsive web design

---

**Note**: This web application is a conversion of the Android APK. All images and audio files are from the original application.

