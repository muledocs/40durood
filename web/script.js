// Configuration
const CONFIG = {
    imagesPath: 'assets/images/',
    audioPath: 'assets/audio/',
    totalImages: 43,
    totalAudio: 38,
    mappingFile: 'image-audio-mapping.json'
};

// Image to Audio Mapping (will be loaded from JSON)
let imageAudioMapping = null;

// State
let currentImageIndex = 0;
let currentAudioIndex = -1;
let currentPlayingImageNumber = -1; // Track which image number is playing
let images = [];
let audioFiles = [];
let isPlaying = false;

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const audioList = document.getElementById('audio-list');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');
const prevImageBtn = document.getElementById('prev-image');
const nextImageBtn = document.getElementById('next-image');
const currentImageNum = document.getElementById('current-image-num');
const totalImages = document.getElementById('total-images');
const audioElement = document.getElementById('audio-element');
const playPauseBtn = document.getElementById('play-pause');
const currentTimeSpan = document.getElementById('current-time');
const totalTimeSpan = document.getElementById('total-time');
const playerTitle = document.getElementById('player-title');
const audioPlayer = document.getElementById('audio-player');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const modalPlayBtn = document.getElementById('modal-play-btn');

// Swipe detection (touch and mouse)
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let mouseStartX = 0;
let mouseEndX = 0;
let isDragging = false;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadImageAudioMapping();
    } catch (error) {
        console.error('Error loading mapping:', error);
    }
    
    // Initialize images regardless of mapping load status
    initializeImages();
    initializeAudio();
    setupEventListeners();
    setupGalleryScrollDetection();
    setupPWA();
    if (totalImages) {
        totalImages.textContent = CONFIG.totalImages;
    }
});

// Setup Progressive Web App
function setupPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js', { scope: './' })
                .then((registration) => {
                    console.log('Service Worker registered successfully:', registration.scope);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
    
    // Show install prompt
    let deferredPrompt;
    const installButton = createInstallButton();
    
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt event fired');
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show install button
        showInstallButton(installButton);
    });
    
    // Handle install button click
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) {
            console.log('No deferred prompt available');
            return;
        }
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('User choice:', outcome);
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the deferredPrompt
        deferredPrompt = null;
        hideInstallButton(installButton);
    });
    
    // Hide install button if app is already installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        hideInstallButton(installButton);
        deferredPrompt = null;
    });
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        console.log('App is already installed');
        hideInstallButton(installButton);
    }
    
    // For iOS Safari - show manual install instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
    
    if (isIOS && !isInStandaloneMode) {
        // Show iOS install instructions after a delay
        setTimeout(() => {
            showIOSInstallInstructions();
        }, 3000);
    }
}

// Show iOS install instructions
function showIOSInstallInstructions() {
    const instructions = document.createElement('div');
    instructions.id = 'ios-install-instructions';
    instructions.className = 'ios-install-instructions';
    instructions.innerHTML = `
        <div class="ios-install-content">
            <h3>📱 Install App</h3>
            <p>Tap the Share button <span style="font-size: 1.2em;">📤</span> and select "Add to Home Screen"</p>
            <button class="ios-install-close">✕</button>
        </div>
    `;
    document.body.appendChild(instructions);
    
    const closeBtn = instructions.querySelector('.ios-install-close');
    closeBtn.addEventListener('click', () => {
        instructions.remove();
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (instructions.parentNode) {
            instructions.remove();
        }
    }, 10000);
}

// Convert number to Arabic numerals
function convertToArabic(num) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
}

// Load Image-Audio Mapping
async function loadImageAudioMapping() {
    try {
        const response = await fetch(CONFIG.mappingFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        imageAudioMapping = data.mapping;
        console.log('Image-Audio mapping loaded:', imageAudioMapping.length, 'items');
    } catch (error) {
        console.warn('Could not load mapping file, using default mapping:', error);
        // Create default mapping (skip first 3 images)
        imageAudioMapping = [];
        for (let i = 1; i <= CONFIG.totalImages; i++) {
            imageAudioMapping.push({
                fileIndex: i,
                imageNumber: i > 3 ? i - 3 : i,
                arabicNumber: convertToArabic(i > 3 ? i - 3 : i),
                audioFile: i > 3 ? `${String(i - 3).padStart(2, '0')}.mp3` : null,
                hasAudio: i > 3
            });
        }
    }
}

// Create install button
function createInstallButton() {
    const button = document.createElement('button');
    button.id = 'install-button';
    button.className = 'install-button';
    button.innerHTML = `
        <span class="install-icon">📱</span>
        <span class="install-text">Install App</span>
    `;
    button.style.display = 'none';
    document.body.appendChild(button);
    return button;
}

// Show install button
function showInstallButton(button) {
    button.style.display = 'flex';
    setTimeout(() => {
        button.classList.add('show');
    }, 100);
}

// Hide install button
function hideInstallButton(button) {
    button.classList.remove('show');
    setTimeout(() => {
        button.style.display = 'none';
    }, 300);
}

// Initialize Images
function initializeImages() {
    images = [];
    for (let i = 1; i <= CONFIG.totalImages; i++) {
        // Find mapping by fileIndex (screen_1.png = fileIndex 1, screen_2.png = fileIndex 2, etc.)
        const mapping = imageAudioMapping ? imageAudioMapping.find(m => m.fileIndex === i) : null;
        images.push({
            fileIndex: i, // File number (screen_1.png, screen_2.png, etc.)
            number: mapping ? mapping.imageNumber : (i > 3 ? i - 3 : i), // Actual Durood number from image
            src: `${CONFIG.imagesPath}screen_${i}.png`,
            arabicNumber: mapping ? mapping.arabicNumber : convertToArabic(mapping ? mapping.imageNumber : (i > 3 ? i - 3 : i)),
            audioFile: mapping ? mapping.audioFile : null,
            hasAudio: mapping ? mapping.hasAudio : (i > 3),
            containsMultiple: mapping ? (mapping.containsMultiple || false) : false,
            numbers: mapping && mapping.numbers ? mapping.numbers : null
        });
    }
    renderGallery();
}

// Render Gallery
function renderGallery() {
    if (!galleryGrid) {
        console.error('Gallery grid element not found');
        return;
    }
    galleryGrid.innerHTML = '';
    images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-image-index', index);
        
        // Check if image has audio from mapping
        const hasAudio = image.hasAudio !== undefined ? image.hasAudio : (image.fileIndex > 3);
        const playButtonHtml = hasAudio ? `
            <button class="gallery-play-btn" data-image-index="${index}" title="Play Audio">
                <span class="play-icon">▶</span>
            </button>
        ` : '';
        
        // No numbers displayed on images
        item.innerHTML = `
            <img src="${image.src}" alt="Durood Sharif ${image.number}" loading="lazy">
            ${playButtonHtml}
        `;
        
        // No click to open modal - removed as per user request
        
        // Play button click plays audio (only if button exists)
        if (hasAudio) {
            const playBtn = item.querySelector('.gallery-play-btn');
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playAudioForImage(image.fileIndex);
            });
        }
        
        galleryGrid.appendChild(item);
    });
    
    // Initialize to first image (carousel view for all devices)
    currentImageIndex = 0;
    scrollToGalleryImage(0);
    
    updateGalleryPlayButtons();
}

// Open Image Modal
function openImageModal(index) {
    currentImageIndex = index;
    updateModalImage();
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Image Modal
function closeImageModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Update Modal Image - removed (no modal)
function updateModalImage() {
    // Modal functionality removed
}

// Get audio index from image fileIndex using mapping
function getAudioIndexForImage(fileIndex) {
    if (!imageAudioMapping) {
        // Fallback to old logic if mapping not loaded
        if (fileIndex <= 3) {
            return -1;
        }
        const audioNumber = fileIndex - 3;
        const audioIndex = audioFiles.findIndex(audio => audio.number === audioNumber);
        return audioIndex >= 0 ? audioIndex : -1;
    }
    
    // Find mapping for this image file (by fileIndex)
    const mapping = imageAudioMapping.find(m => m.fileIndex === fileIndex);
    if (!mapping || !mapping.hasAudio || !mapping.audioFile) {
        return -1;
    }
    
    // Find audio file by filename
    const audioIndex = audioFiles.findIndex(audio => {
        // Extract filename from audio src
        const audioFilename = audio.src.split('/').pop();
        return audioFilename === mapping.audioFile;
    });
    
    return audioIndex >= 0 ? audioIndex : -1;
}

// Play audio for specific image (by fileIndex)
function playAudioForImage(fileIndex) {
    const audioIndex = getAudioIndexForImage(fileIndex);
    if (audioIndex >= 0) {
        // Get the correct Durood number from mapping
        const mapping = imageAudioMapping ? imageAudioMapping.find(m => m.fileIndex === fileIndex) : null;
        if (mapping) {
            currentPlayingImageNumber = mapping.imageNumber; // Use imageNumber from mapping
        } else {
            const image = images.find(img => img.fileIndex === fileIndex);
            currentPlayingImageNumber = image ? image.number : fileIndex;
        }
        playAudio(audioIndex);
        updateGalleryPlayButtons();
    }
}

// Update modal play button state - removed (no modal)
function updateModalPlayButton() {
    // Modal functionality removed
}

// Update gallery play buttons state
function updateGalleryPlayButtons() {
    document.querySelectorAll('.gallery-play-btn').forEach((btn, index) => {
        const image = images[index];
        const audioIndex = getAudioIndexForImage(image.fileIndex);
        
        if (currentAudioIndex === audioIndex && isPlaying) {
            btn.classList.add('playing');
        } else {
            btn.classList.remove('playing');
        }
    });
}

// Navigate Images
function navigateImage(direction) {
    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % images.length;
    } else {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    }
    updateModalImage();
}

// Initialize Audio
function initializeAudio() {
    audioFiles = [];
    
    // Standard numbered audio files (01-38)
    for (let i = 1; i <= CONFIG.totalAudio; i++) {
        const audioName = `${String(i).padStart(2, '0')}.mp3`;
        audioFiles.push({
            number: i,
            name: `Durood ${i}`,
            src: `${CONFIG.audioPath}${audioName}`
        });
    }
    
    // Add special audio files if they exist
    const specialAudios = [
        { name: '15(1).mp3', displayName: 'Durood 15 (1)' },
        { name: '15(2).mp3', displayName: 'Durood 15 (2)' },
        { name: '20(1).mp3', displayName: 'Durood 20 (1)' },
        { name: '20(2).mp3', displayName: 'Durood 20 (2)' },
        { name: 'ringtone1.mp3', displayName: 'Ringtone' }
    ];
    
    specialAudios.forEach((audio, index) => {
        audioFiles.push({
            number: CONFIG.totalAudio + index + 1,
            name: audio.displayName,
            src: `${CONFIG.audioPath}${audio.name}`
        });
    });
    
    renderAudioList();
}

// Render Audio List
function renderAudioList() {
    audioList.innerHTML = '';
    audioFiles.forEach((audio, index) => {
        const item = document.createElement('div');
        item.className = 'audio-item';
        item.innerHTML = `
            <div class="audio-icon">🎵</div>
            <div class="audio-info">
                <div class="audio-name">${audio.name}</div>
                <div class="audio-duration">Loading...</div>
            </div>
            <button class="play-audio-btn" data-index="${index}">▶</button>
        `;
        
        const playBtn = item.querySelector('.play-audio-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playAudio(index);
        });
        
        // Load duration
        loadAudioDuration(audio.src, item.querySelector('.audio-duration'));
        
        audioList.appendChild(item);
    });
}

// Load Audio Duration
function loadAudioDuration(src, durationElement) {
    const audio = new Audio(src);
    audio.addEventListener('loadedmetadata', () => {
        const duration = formatTime(audio.duration);
        durationElement.textContent = duration;
    });
    audio.addEventListener('error', () => {
        durationElement.textContent = 'N/A';
    });
}

// Play Audio
function playAudio(index) {
    // If same audio is playing, pause it
    if (currentAudioIndex === index && isPlaying) {
        pauseAudio();
        updateGalleryPlayButtons();
        return;
    }
    
    // Stop current audio if different audio is requested
    if (isPlaying && currentAudioIndex !== index) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
    
    currentAudioIndex = index;
    const audio = audioFiles[index];
    
    // Load and play new audio
    audioElement.src = audio.src;
    audioElement.load();
    audioElement.play();
    
    isPlaying = true;
    updatePlayPauseButton();
    updateAudioPlayerUI();
    showAudioPlayer();
    updateGalleryPlayButtons();
    
    // Update active state in list
    document.querySelectorAll('.audio-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

// Pause Audio
function pauseAudio() {
    audioElement.pause();
    isPlaying = false;
    updatePlayPauseButton();
    updateGalleryPlayButtons();
    // Don't reset currentPlayingImageNumber so it still shows when paused
}

// Resume Audio
function resumeAudio() {
    audioElement.play();
    isPlaying = true;
    updatePlayPauseButton();
}

// Update Play/Pause Button
function updatePlayPauseButton() {
    playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
}

// Update Audio Player UI
function updateAudioPlayerUI() {
    if (currentAudioIndex >= 0 && currentPlayingImageNumber > 0) {
        // Show English number from image
        playerTitle.textContent = `Durood ${currentPlayingImageNumber}`;
    } else if (currentAudioIndex >= 0) {
        // Fallback to audio name if image number not available
        const audio = audioFiles[currentAudioIndex];
        playerTitle.textContent = audio.name;
    }
}

// Show Audio Player
function showAudioPlayer() {
    audioPlayer.classList.add('active');
}

// Hide Audio Player
function hideAudioPlayer() {
    audioPlayer.classList.remove('active');
}


// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update Progress
function updateProgress() {
    if (audioElement.duration) {
        currentTimeSpan.textContent = formatTime(audioElement.currentTime);
        totalTimeSpan.textContent = formatTime(audioElement.duration);
    }
}

// Swipe detection functions
let isSwiping = false;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = false;
}

function handleTouchMove(e) {
    // Prevent default scrolling during swipe to reduce shakiness
    const currentX = e.changedTouches[0].screenX;
    const currentY = e.changedTouches[0].screenY;
    const diffX = Math.abs(touchStartX - currentX);
    const diffY = Math.abs(touchStartY - currentY);
    
    if (diffX > 10) {
        isSwiping = true;
        // Prevent scrolling when swiping horizontally (more horizontal than vertical)
        if (diffX > diffY) {
            e.preventDefault();
        }
    }
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    if (isSwiping) {
        handleSwipe();
    }
    isSwiping = false;
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        // Stop audio when swiping to another image
        if (isPlaying) {
            pauseAudio();
        }
        
        if (diff > 0) {
            // Swipe from right to left (finger moves left) - next image
            navigateGalleryImage('next');
        } else {
            // Swipe from left to right (finger moves right) - previous image
            navigateGalleryImage('prev');
        }
    }
}

// Mouse drag handlers for desktop
function handleMouseDown(e) {
    mouseStartX = e.clientX;
    isDragging = false;
    e.preventDefault();
}

function handleMouseMove(e) {
    if (mouseStartX !== 0) {
        const diff = Math.abs(mouseStartX - e.clientX);
        if (diff > 10) {
            isDragging = true;
        }
    }
}

function handleMouseUp(e) {
    if (isDragging && mouseStartX !== 0) {
        mouseEndX = e.clientX;
        const diff = mouseStartX - mouseEndX;
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Stop audio when dragging to another image
            if (isPlaying) {
                pauseAudio();
            }
            
            if (diff > 0) {
                // Drag from right to left - next image
                navigateGalleryImage('next');
            } else {
                // Drag from left to right - previous image
                navigateGalleryImage('prev');
            }
        }
    }
    
    mouseStartX = 0;
    mouseEndX = 0;
    isDragging = false;
}

// Mouse drag handlers for desktop
function handleMouseDown(e) {
    mouseStartX = e.clientX;
    isDragging = false;
    e.preventDefault();
}

function handleMouseMove(e) {
    if (mouseStartX !== 0) {
        const diff = Math.abs(mouseStartX - e.clientX);
        if (diff > 10) {
            isDragging = true;
        }
    }
}

function handleMouseUp(e) {
    if (isDragging && mouseStartX !== 0) {
        mouseEndX = e.clientX;
        const diff = mouseStartX - mouseEndX;
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Stop audio when dragging to another image
            if (isPlaying) {
                pauseAudio();
            }
            
            if (diff > 0) {
                // Drag from right to left - next image
                navigateGalleryImage('next');
            } else {
                // Drag from left to right - previous image
                navigateGalleryImage('prev');
            }
        }
    }
    
    mouseStartX = 0;
    mouseEndX = 0;
    isDragging = false;
}

// Navigate gallery images (for mobile carousel)
function navigateGalleryImage(direction) {
    if (direction === 'next') {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            scrollToGalleryImage(currentImageIndex);
        }
    } else {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            scrollToGalleryImage(currentImageIndex);
        }
    }
}

// Scroll to specific gallery image
function scrollToGalleryImage(index) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems[index]) {
        // Use instant scroll to reduce shakiness during swipe
        galleryItems[index].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
        // Update play button states
        updateGalleryPlayButtons();
        
        // Update current image index
        currentImageIndex = index;
    }
}

// Detect when user scrolls gallery (for mobile)
function setupGalleryScrollDetection() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;
    
    let scrollTimeout;
    let lastImageIndex = currentImageIndex;
    
    galleryGrid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Find which image is currently in view
            const galleryItems = document.querySelectorAll('.gallery-item');
            const containerRect = galleryGrid.getBoundingClientRect();
            
            galleryItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                // Check if item is mostly visible
                if (itemRect.left >= containerRect.left - itemRect.width / 2 && 
                    itemRect.right <= containerRect.right + itemRect.width / 2) {
                    // If image changed, stop audio
                    if (index !== lastImageIndex && isPlaying) {
                        pauseAudio();
                    }
                    currentImageIndex = index;
                    lastImageIndex = index;
                    updateGalleryPlayButtons();
                }
            });
        }, 150);
    }, { passive: true });
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    // Modal functionality removed - no click to open popup
    
    // Swipe support for mobile and desktop - gallery (carousel view)
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        // Touch events for mobile
        galleryContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        galleryContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        galleryContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Mouse events for desktop drag
        galleryContainer.addEventListener('mousedown', handleMouseDown);
        galleryContainer.addEventListener('mousemove', handleMouseMove);
        galleryContainer.addEventListener('mouseup', handleMouseUp);
        galleryContainer.addEventListener('mouseleave', handleMouseUp);
    }
    
    // Keyboard navigation for desktop
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateGalleryImage('prev');
        } else if (e.key === 'ArrowRight') {
            navigateGalleryImage('next');
        }
    });
    
    // Audio player controls
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            if (currentAudioIndex >= 0) {
                resumeAudio();
            }
        }
    });
    
    
    // Audio element events
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayPauseButton();
        updateGalleryPlayButtons();
        // Stop when audio completes - no auto-play next
    });
    audioElement.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(audioElement.duration);
    });
}

