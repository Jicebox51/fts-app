#!/bin/bash

# Directory containing audio files
AUDIO_DIR="./public/audio"

# Output JSON file
OUTPUT_FILE="./public/json/audioFiles.json"

# Ensure the output directory exists
mkdir -p "$(dirname "$OUTPUT_FILE")"

echo "Script started. Searching for audio files in $AUDIO_DIR"

# Check if the audio directory exists
if [ ! -d "$AUDIO_DIR" ]; then
    echo "Error: Audio directory $AUDIO_DIR does not exist."
    exit 1
fi

# Generate JSON array of audio files
echo "[" > "$OUTPUT_FILE"
first=true
found_files=false

# Use find command to locate audio files (case-insensitive)
while IFS= read -r -d '' file; do
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    filename=$(basename "$file")
    echo "  \"$filename\"" >> "$OUTPUT_FILE"
    echo "Found audio file: $filename"
    found_files=true
done < <(find "$AUDIO_DIR" -type f \( -iname "*.mp3" -o -iname "*.wma" -o -iname "*.flac" -o -iname "*.wav" -o -iname "*.ogg" \) -print0)

echo "]" >> "$OUTPUT_FILE"

if [ "$found_files" = false ]; then
    echo "Warning: No audio files found in $AUDIO_DIR"
else
    echo "Audio files found and added to playlist"
fi

echo "Contents of $OUTPUT_FILE:"
cat "$OUTPUT_FILE"

echo "Playlist updated in $OUTPUT_FILE"
