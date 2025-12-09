#!/usr/bin/env python3
"""
Script to extract APK file contents including images, audio, and other assets.
APK files are essentially ZIP archives, so we can extract them directly.
"""

import zipfile
import os
import shutil
import json
from pathlib import Path

def extract_apk(apk_path, output_dir):
    """Extract APK file to output directory."""
    apk_path = Path(apk_path)
    output_dir = Path(output_dir)
    
    if not apk_path.exists():
        print(f"Error: APK file not found at {apk_path}")
        return False
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Extract APK (it's a ZIP file)
    print(f"Extracting {apk_path.name}...")
    with zipfile.ZipFile(apk_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    
    print(f"Extracted to {output_dir}")
    
    # Organize extracted files
    organize_files(output_dir)
    
    return True

def organize_files(extracted_dir):
    """Organize extracted files into logical directories."""
    extracted_dir = Path(extracted_dir)
    
    # Create organized directories
    assets_dir = extracted_dir / "assets_organized"
    images_dir = assets_dir / "images"
    audio_dir = assets_dir / "audio"
    other_dir = assets_dir / "other"
    
    for dir_path in [images_dir, audio_dir, other_dir]:
        dir_path.mkdir(parents=True, exist_ok=True)
    
    # Find and organize files
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'}
    audio_extensions = {'.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'}
    
    files_info = {
        'images': [],
        'audio': [],
        'other': []
    }
    
    for root, dirs, files in os.walk(extracted_dir):
        # Skip the organized directory itself
        if 'assets_organized' in root:
            continue
            
        for file in files:
            file_path = Path(root) / file
            rel_path = file_path.relative_to(extracted_dir)
            
            # Skip certain system files
            if file.startswith('.') or file in ['AndroidManifest.xml', 'classes.dex', 'resources.arsc']:
                continue
            
            ext = file_path.suffix.lower()
            
            if ext in image_extensions:
                dest = images_dir / file
                shutil.copy2(file_path, dest)
                files_info['images'].append(str(rel_path))
            elif ext in audio_extensions:
                dest = audio_dir / file
                shutil.copy2(file_path, dest)
                files_info['audio'].append(str(rel_path))
            else:
                dest = other_dir / file
                shutil.copy2(file_path, dest)
                files_info['other'].append(str(rel_path))
    
    # Save file manifest
    manifest_path = assets_dir / "manifest.json"
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(files_info, f, indent=2, ensure_ascii=False)
    
    print(f"\nOrganized files:")
    print(f"  Images: {len(files_info['images'])}")
    print(f"  Audio: {len(files_info['audio'])}")
    print(f"  Other: {len(files_info['other'])}")
    print(f"\nFiles organized in: {assets_dir}")
    
    return files_info

if __name__ == "__main__":
    apk_file = "Durood sharif with audio.apk"
    output_directory = "extracted_apk"
    
    if extract_apk(apk_file, output_directory):
        print("\n✓ Extraction complete!")
    else:
        print("\n✗ Extraction failed!")

