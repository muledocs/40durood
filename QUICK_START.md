# Quick Start - Android App

## 🚀 Build Your Android App in 3 Steps

### Step 1: Open in Android Studio

```bash
npm run android
```

This will open the Android project in Android Studio.

### Step 2: Build APK

In Android Studio:
1. Wait for Gradle sync to complete
2. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to finish
4. Click **locate** in the notification
5. Your APK is ready! 📱

### Step 3: Install on Device

**Option A - Via USB:**
1. Enable USB Debugging on your Android device
2. Connect via USB
3. Click the green "Run" button in Android Studio

**Option B - Transfer APK:**
1. Copy `android/app/build/outputs/apk/debug/app-debug.apk` to your phone
2. Install it manually

## 📋 Requirements

- Android Studio (download from https://developer.android.com/studio)
- Java JDK 11+ (comes with Android Studio)
- Android device or emulator

## 🔄 After Making Web Changes

When you update files in the `web/` folder:

```bash
npm run sync:android
```

Then rebuild the APK in Android Studio.

## 📱 App Details

- **Package**: com.muledocs.durood
- **Name**: Durood Sharif
- **Min Android**: 5.1 (API 22)
- **Target Android**: 14 (API 34)

## 📚 Full Documentation

See `ANDROID_BUILD_GUIDE.md` for detailed instructions.

