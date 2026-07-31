#!/bin/bash

# Configuration
ROOT_DIR="/var/www/kendrick/be.kendrickheller.com/apps/api/uploads"
IMAGES_DIR="$ROOT_DIR/images"
THUMB_DIR="$IMAGES_DIR/thumb"

echo "Starting image migration in $ROOT_DIR..."

# Create target directories if they don't exist
mkdir -p "$IMAGES_DIR"
mkdir -p "$THUMB_DIR"

# 1. Move all existing file-* images from uploads/ directly into uploads/images/
echo "Moving file-* images from uploads/ to uploads/images/..."
for ext in jpg jpeg png gif webp svg; do
    find "$ROOT_DIR" -maxdepth 1 -type f -iname "file-*.$ext" -exec mv -n {} "$IMAGES_DIR/" \;
done

# 2. Move all old categorized images from images/<sub-folder>/ to images/
echo "Consolidating sub-folder images..."
find "$IMAGES_DIR" -mindepth 2 -maxdepth 2 -type f -exec mv -n {} "$IMAGES_DIR/" \;

# 3. Move all thumbs from images/<sub-folder>/thumb/ to images/thumb/
echo "Consolidating thumb images..."
find "$IMAGES_DIR" -mindepth 3 -maxdepth 3 -type f -path "*/thumb/*" -exec mv -n {} "$THUMB_DIR/" \;

# 4. Cleanup empty directories
echo "Cleaning up empty directories..."
find "$IMAGES_DIR" -mindepth 1 -type d -empty -delete

echo "Migration completed!"
