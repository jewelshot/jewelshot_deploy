# Catalogue Favorites Fix - Troubleshooting Guide

## Problem

Favorited images are not showing up in the Catalogue page.

## Solution Steps

### Step 1: Check if Supabase Tables Exist

Go to your Supabase Dashboard → SQL Editor and run:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('image_metadata', 'favorite_images');
```

**Expected Result:** Should return 2 rows (image_metadata and favorite_images)

**If tables don't exist:** Continue to Step 2
**If tables exist:** Skip to Step 3

### Step 2: Run Migration to Create Tables

In Supabase SQL Editor, run the entire migration file:
`supabase/migrations/20250125_image_metadata_favorites.sql`

Or copy-paste this SQL:

```sql
-- ============================================================================
-- IMAGE METADATA & FAVORITES SYSTEM
-- ============================================================================

-- 1. IMAGE METADATA TABLE
CREATE TABLE IF NOT EXISTS image_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_id TEXT NOT NULL,
  file_name TEXT NOT NULL DEFAULT 'Untitled',
  carat DECIMAL(10, 2),
  color TEXT,
  clarity TEXT,
  setting TEXT,
  weight DECIMAL(10, 2),
  description TEXT,
  price DECIMAL(10, 2),
  sku TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, image_id)
);

CREATE INDEX IF NOT EXISTS idx_image_metadata_user_id ON image_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_image_metadata_image_id ON image_metadata(image_id);
CREATE INDEX IF NOT EXISTS idx_image_metadata_user_image ON image_metadata(user_id, image_id);

-- 2. FAVORITE IMAGES TABLE
CREATE TABLE IF NOT EXISTS favorite_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_id TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, image_id)
);

CREATE INDEX IF NOT EXISTS idx_favorite_images_user_id ON favorite_images(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_images_user_order ON favorite_images(user_id, order_index);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_images ENABLE ROW LEVEL SECURITY;

-- Image Metadata Policies
CREATE POLICY "Users can view their own metadata"
  ON image_metadata FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metadata"
  ON image_metadata FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metadata"
  ON image_metadata FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metadata"
  ON image_metadata FOR DELETE
  USING (auth.uid() = user_id);

-- Favorite Images Policies
CREATE POLICY "Users can view their own favorites"
  ON favorite_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorite_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
  ON favorite_images FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorite_images FOR DELETE
  USING (auth.uid() = user_id);

-- 4. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_image_metadata_updated_at ON image_metadata;
CREATE TRIGGER update_image_metadata_updated_at
  BEFORE UPDATE ON image_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Check Existing Favorites Data

After tables are created, check if favorites are actually being saved:

```sql
-- Check your user ID
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL';

-- Check favorites for your user (replace USER_ID with your actual user ID)
SELECT * FROM favorite_images WHERE user_id = 'YOUR_USER_ID';
```

### Step 4: Manual Test - Add a Favorite

1. Go to Gallery page
2. Click the star icon on any image
3. You should see a success toast: "Added to favorites"
4. Run this query to verify:

```sql
SELECT
  fi.*,
  im.file_name
FROM favorite_images fi
LEFT JOIN image_metadata im ON fi.image_id = im.image_id AND fi.user_id = im.user_id
WHERE fi.user_id = 'YOUR_USER_ID'
ORDER BY fi.order_index;
```

### Step 5: Check Browser Console

1. Open Catalogue page
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for these messages:
   - ✅ `[ImageMetadataStore] Synced from Supabase successfully`
   - ✅ `[Catalogue] Catalogue loaded with favorites: X` (where X > 0)
   - ❌ Any error messages in red

### Step 6: Clear LocalStorage Cache

Sometimes old cache can cause issues:

```javascript
// Run this in browser console (F12)
localStorage.removeItem('jewelshot-image-metadata');
location.reload();
```

### Step 7: Force Re-favorite Images

If favorites were added before the Supabase migration:

1. Go to Gallery
2. Un-favorite all images (click star to remove)
3. Re-favorite them (click star to add)
4. Go to Catalogue - they should now appear

## Common Issues

### Issue: "No Favorites Yet" but I added favorites

**Cause:** Supabase tables don't exist or RLS policies are wrong
**Fix:** Run Step 2 migration

### Issue: Favorites show in Gallery but not Catalogue

**Cause:** syncFromSupabase() failing
**Fix:** Check browser console for errors, verify Supabase connection

### Issue: Getting "permission denied" errors

**Cause:** RLS policies not properly configured
**Fix:** Re-run the RLS policy section from Step 2

## Debug Mode

To see detailed logs, open browser console and run:

```javascript
localStorage.setItem('jewelshot:debug', 'true');
location.reload();
```

This will show detailed logging from the ImageMetadataStore and Catalogue components.
