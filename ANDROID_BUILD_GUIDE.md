# Android App Build Guide

This guide will help you build the Durood Sharif Android app from the web application.

## Prerequisites

1. **Android Studio** - Download from https://developer.android.com/studio
2. **Java JDK 11 or higher** - Usually comes with Android Studio
3. **Android SDK** - Installed via Android Studio SDK Manager
4. **Node.js** - Already installed (v22.17.0)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Sync Capacitor

After making changes to your web app, sync them to Android:

```bash
npm run sync:android
```

Or use the full sync:

```bash
npm run sync
```

### 3. Open in Android Studio

```bash
npm run android
```

Or manually:
- Open Android Studio
- Click "Open an Existing Project"
- Navigate to the `android` folder
- Click OK

### 4. Build the APK

#### Option A: Build via Android Studio

1. Open the project in Android Studio
2. Wait for Gradle sync to complete
3. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. Wait for the build to complete
5. Click **locate** when the notification appears
6. The APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Option B: Build via Command Line

```bash
cd android
./gradlew assembleDebug
```

The APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Build Release APK (For Distribution)

1. First, create a keystore (if you don't have one):

```bash
keytool -genkey -v -keystore durood-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias durood-key
```

2. Create `android/key.properties`:

```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=durood-key
storeFile=../durood-release-key.jks
```

3. Update `android/app/build.gradle` to use the keystore (already configured if you follow the steps)

4. Build release APK:

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

## Testing on Device

### Via USB Debugging

1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. Connect your device via USB

3. Run from Android Studio:
   - Click the green "Run" button
   - Select your device
   - The app will install and launch

### Via ADB

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## App Configuration

### App Details

- **Package Name**: `com.muledocs.durood`
- **App Name**: Durood Sharif
- **Min SDK**: 22 (Android 5.1)
- **Target SDK**: 34 (Android 14)
- **Version**: 1.0

### Permissions

The app requests these permissions:
- Internet (for web resources)
- Read External Storage (for audio files)
- Read Media Audio (Android 13+)
- Foreground Service (for audio playback)
- Wake Lock (to keep screen on during audio playback)

## Troubleshooting

### Gradle Sync Failed

1. Check your internet connection
2. In Android Studio: **File** → **Invalidate Caches / Restart**
3. Try: `cd android && ./gradlew clean`

### Build Errors

1. Make sure you have the latest Android SDK installed
2. Check that `compileSdkVersion` matches your installed SDK
3. Update Gradle wrapper if needed

### App Crashes on Launch

1. Check Logcat in Android Studio for error messages
2. Make sure all assets are synced: `npm run sync:android`
3. Verify web files are in the `web` directory

### Audio Not Playing

1. Check that audio files are in `web/assets/audio/`
2. Verify permissions are granted
3. Check Logcat for audio-related errors

## Updating the App

After making changes to your web app:

1. Make your changes in the `web` folder
2. Sync to Android: `npm run sync:android`
3. Rebuild the APK

## Publishing to Google Play Store

1. Build a release APK (see above)
2. Create a Google Play Console account
3. Create a new app
4. Upload the APK
5. Fill in store listing details
6. Submit for review

## File Structure

```
durood/
├── web/                    # Web application files
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── assets/
├── android/                # Android native project
│   ├── app/
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── assets/public/  # Synced web files
│   └── build.gradle
├── capacitor.config.json    # Capacitor configuration
└── package.json
```

## Useful Commands

```bash
# Sync web files to Android
npm run sync:android

# Open Android Studio
npm run android

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease

# Clean build
cd android && ./gradlew clean
```

## Notes

- The web app is automatically synced to `android/app/src/main/assets/public/`
- All web assets (images, audio) are bundled in the APK
- The app works offline after installation
- PWA features are preserved in the native app

