# Android Compatibility Update Guide

This guide will help you update the APK to support the latest Android versions (Android 14 and above).

## Current Status
- **Current Support**: Android 13 (API Level 33)
- **Target Support**: Android 14+ (API Level 34+)

## Method 1: Using Android Studio (Recommended)

### Prerequisites
1. Download and install [Android Studio](https://developer.android.com/studio)
2. Extract the APK source code (if you have it) or use a decompiler

### Steps

1. **Open the Project in Android Studio**
   ```bash
   # If you have the source code
   File > Open > Select your project folder
   ```

2. **Update build.gradle (Module: app)**
   
   Open `app/build.gradle` and update:
   ```gradle
   android {
       compileSdkVersion 34  // Update to latest
       
       defaultConfig {
           minSdkVersion 21  // Keep minimum support
           targetSdkVersion 34  // Update to latest
           ...
       }
   }
   
   dependencies {
       // Update support libraries to latest versions
       implementation 'androidx.appcompat:appcompat:1.6.1'
       implementation 'com.google.android.material:material:1.11.0'
       // Add other dependencies as needed
   }
   ```

3. **Update AndroidManifest.xml**
   
   Add required permissions and features for newer Android versions:
   ```xml
   <manifest xmlns:android="http://schemas.android.com/apk/res/android"
       package="your.package.name">
       
       <!-- Add these for Android 13+ -->
       <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
       <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
       
       <!-- For Android 12+ -->
       <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
       
       <application
           android:targetSdkVersion="34"
           android:usesCleartextTraffic="true"
           ...>
       </application>
   </manifest>
   ```

4. **Handle Runtime Permissions**
   
   For Android 13+, you need to request runtime permissions for media files:
   ```java
   // In your Activity
   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
       if (ContextCompat.checkSelfPermission(this, 
           Manifest.permission.READ_MEDIA_AUDIO) != PackageManager.PERMISSION_GRANTED) {
           ActivityCompat.requestPermissions(this,
               new String[]{Manifest.permission.READ_MEDIA_AUDIO},
               REQUEST_CODE);
       }
   }
   ```

5. **Build and Sign the APK**
   - Build > Generate Signed Bundle / APK
   - Follow the signing wizard
   - Select "APK" and complete the process

## Method 2: Using APK Tool (Advanced)

If you don't have the source code, you can modify the APK directly:

### Prerequisites
1. Install [APKTool](https://ibotpeaches.github.io/Apktool/)
2. Install [Java JDK](https://www.oracle.com/java/technologies/downloads/)

### Steps

1. **Decompile the APK**
   ```bash
   apktool d "Durood sharif with audio.apk" -o decompiled_apk
   ```

2. **Edit AndroidManifest.xml**
   
   Navigate to `decompiled_apk/AndroidManifest.xml` and update:
   ```xml
   <uses-sdk android:minSdkVersion="21" 
            android:targetSdkVersion="34" 
            android:maxSdkVersion="34" />
   ```

3. **Update build files** (if using Gradle)
   
   Edit `decompiled_apk/apktool.yml`:
   ```yaml
   version: 2.7.0
   apkFileName: Durood sharif with audio.apk
   minSdkVersion: '21'
   targetSdkVersion: '34'
   ```

4. **Recompile the APK**
   ```bash
   apktool b decompiled_apk -o updated_apk.apk
   ```

5. **Sign the APK**
   ```bash
   # Generate keystore (first time only)
   keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
   
   # Sign the APK
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks updated_apk.apk my-key-alias
   
   # Align the APK
   zipalign -v 4 updated_apk.apk final_apk.apk
   ```

## Method 3: Quick Fix (Using Online Tools)

1. **Use APK Editor Studio** or similar tools:
   - Download [APK Editor Studio](https://qwertycube.com/apk-editor-studio/)
   - Open your APK file
   - Navigate to AndroidManifest.xml
   - Change `targetSdkVersion` to 34
   - Save and rebuild

## Important Considerations

### 1. **Runtime Permissions**
Android 13+ requires explicit permission requests for:
- Reading media files (audio, images)
- Posting notifications
- Accessing location (if applicable)

### 2. **Foreground Services**
If your app uses background audio playback:
- Declare foreground service types in manifest
- Request FOREGROUND_SERVICE permission
- Show persistent notification

### 3. **File Access**
Android 11+ uses scoped storage:
- Use MediaStore API for accessing media files
- Request MANAGE_EXTERNAL_STORAGE only if absolutely necessary

### 4. **Testing**
Test on:
- Android 13 (API 33)
- Android 14 (API 34)
- Latest Android version available

## Troubleshooting

### Issue: App crashes on newer Android versions
**Solution**: Check logcat for specific errors, likely related to:
- Missing permissions
- Deprecated APIs
- File access issues

### Issue: Audio files not playing
**Solution**: 
- Ensure READ_MEDIA_AUDIO permission is granted
- Use MediaPlayer or ExoPlayer with proper error handling
- Check file paths are accessible

### Issue: Images not loading
**Solution**:
- Request READ_MEDIA_IMAGES permission
- Use Glide or Picasso for image loading
- Handle scoped storage properly

## Resources

- [Android Developer Guide](https://developer.android.com/guide)
- [Android API Level Reference](https://developer.android.com/studio/releases/platforms)
- [Migration Guide to Android 14](https://developer.android.com/about/versions/14/migration)

## Alternative: Use the Web Version

If updating the APK is complex, you can use the web version created in this project:
- Open `web/index.html` in a browser
- Works on all devices and Android versions
- No installation required
- Can be deployed as a Progressive Web App (PWA)

