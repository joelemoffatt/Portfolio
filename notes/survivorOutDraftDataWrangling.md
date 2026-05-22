# SurvivoR Data

This directory contains data imported from the [survivoR](https://github.com/doehm/survivoR) repository.

## Data Pipeline

The data flows through a multi-step process:

1. **Import** - Download raw JSON files from survivoR repo → `data/import/`
2. **Transform** - Process and validate data → `data/class-entities/`
3. **Load** - Spring Boot DataLoader reads `class-entities/` files into database

## Update Data from Source

### Step 1: Download Latest Data

Download the latest JSON data files from the survivoR repository:

```bash
cd /Users/joelmoffatt/VSCode/SurvivorOutDraft/survivoR/data/import &&
for file in advantage_details.json advantage_movement.json auction_details.json boot_mapping.json boot_order.json castaway_details.json castaway_scores.json castaways.json challenge_description.json challenge_results.json challenge_summary.json confessionals.json episodes.json journeys.json jury_votes.json season_palettes.json season_summary.json survivor_auction.json tribe_colours.json tribe_mapping.json viewers.json vote_history.json; do
  echo "Downloading $file..."
  curl -s "https://raw.githubusercontent.com/doehm/survivoR/master/dev/json/$file" -o "$file"
done &&
echo "✓ All files downloaded successfully"
```

### Step 2: Process Data

Transform and validate the raw import data into class-entities:

```bash
cd /Users/joelmoffatt/VSCode/SurvivorOutDraft/survivoR &&
python3 scripts/generate_class_entities.py
```

This script:
- Reads raw JSON from `data/import/`
- Validates and transforms data according to JPA entity models
- Outputs processed JSON to `data/class-entities/`

### Step 3: Reload Application

Restart the Spring Boot application with DataLoaderto load the new data into the database.

## Get Castaway Photos (Safe Import)

Use the image importer script to download castaway photos into frontend static assets.

### Default behavior

- Reads pairs from `data/class-entities/castaway_performances.json`
- Downloads from `https://gradientdescending.com/survivor/castaways/colour/{version_season}{castaway_id}.png`
- Saves to `../survivor-outdraft-frontend/assets/castawayPictures/imported/`
- Skips files that already exist

### Commands

Run from the `survivoR/` directory.

```bash
# 1) Preview what will be downloaded (no files written)
python3 scripts/import_castaway_images.py --dry-run

# 2) Download all missing photos
python3 scripts/import_castaway_images.py

# 3) Re-download and replace existing files
python3 scripts/import_castaway_images.py --overwrite
```

Optional flags:

```bash
# Limit number of pairs (quick test)
python3 scripts/import_castaway_images.py --max 25

# Custom output folder
python3 scripts/import_castaway_images.py --output /absolute/path/to/output
```

### Safety checks in the script

- HTTPS only
- Host allowlist (`gradientdescending.com`)
- Filename and ID sanitization
- Content-Type validation (image)
- Max file size cap (5 MB per file)
- Retry with backoff and atomic writes (`.tmp` then rename)

## Directory Structure

- `data/import/` - Raw JSON files from survivoR repository (downloaded from GitHub)
- `data/class-entities/` - Transformed/validated data ready for database import
- `scripts/` - Python scripts for data processing and transformation
  - `generate_class_entities.py` - Main transformation script
  - `jpa_entities.py` - Entity models matching Spring Boot JPA entities
  - `import.py` - Alternative download script using GitHub API

## Notes

- The Spring Boot `DataLoader.java` reads **only** from `data/class-entities/`
- Always run `generate_class_entities.py` after downloading new import data
- Manual edits (like removing castaways) should be done in `data/import/` before processing
