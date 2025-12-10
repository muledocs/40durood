# Image-Audio Mapping Instructions

## Overview

The app uses a mapping file (`web/image-audio-mapping.json`) to match images with their corresponding audio files based on Arabic numbers displayed on each image.

## How to Update the Mapping

1. **Open each image** and identify the Arabic number displayed on it
2. **Find the corresponding audio file** that matches that Arabic number
3. **Update the mapping file** (`web/image-audio-mapping.json`)

## Arabic Numerals Reference

- ٠ = 0
- ١ = 1
- ٢ = 2
- ٣ = 3
- ٤ = 4
- ٥ = 5
- ٦ = 6
- ٧ = 7
- ٨ = 8
- ٩ = 9

Examples:
- ١ = 1
- ١٠ = 10
- ٢٥ = 25
- ٤٣ = 43

## Mapping File Structure

```json
{
  "mapping": [
    {
      "imageNumber": 1,           // Image file number (screen_1.png)
      "arabicNumber": "١",        // Arabic number shown on the image
      "audioFile": null,          // Audio filename (e.g., "01.mp3") or null if no audio
      "hasAudio": false           // Whether this image has audio
    },
    ...
  ]
}
```

## Steps to Analyze Images

1. Open `web/assets/images/screen_1.png` and note the Arabic number
2. Find the audio file that corresponds to that number
3. Update the mapping entry for imageNumber 1
4. Repeat for all 43 images

## Current Default Mapping

The current mapping assumes:
- Images 1-3: No audio
- Image 4 → Audio 01.mp3
- Image 5 → Audio 02.mp3
- ... and so on

**This needs to be verified and corrected based on the actual Arabic numbers in the images.**

## After Updating

1. Save the `image-audio-mapping.json` file
2. Refresh the web page
3. The app will automatically load the new mapping
4. Images will display Arabic numbers
5. Audio will play correctly for each image

## Verification

To verify the mapping is correct:
1. Open an image
2. Note the Arabic number displayed
3. Click the play button
4. Verify the correct audio plays
5. Check the audio player title shows the correct Arabic number

