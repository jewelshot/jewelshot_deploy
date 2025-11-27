# Favorites Test Guide

## Step 1: Check LocalStorage

Open Browser Console (F12) and run:

```javascript
// Check if favorites exist in localStorage
const stored = localStorage.getItem('jewelshot-image-metadata');
if (stored) {
  const parsed = JSON.parse(stored);
  console.log('LocalStorage Data:', parsed);
  console.log('Favorites Count:', parsed.state?.favorites?.length || 0);
  console.log('Favorites:', parsed.state?.favorites);
} else {
  console.log('No localStorage data found');
}
```

## Step 2: Check if Supabase Tables Exist

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Check if tables exist
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('image_metadata', 'favorite_images');

-- If tables exist, check data
SELECT COUNT(*) as total FROM favorite_images;
SELECT * FROM favorite_images LIMIT 5;
```

## Step 3: Manual Sync Test

In browser console, run:

```javascript
// Force sync from Supabase
const { useImageMetadataStore } = await import(
  '/src/store/imageMetadataStore.ts'
);
const store = useImageMetadataStore.getState();
await store.syncFromSupabase();
console.log('After sync - Favorites:', store.favorites);
```

## Step 4: Check User Auth

```javascript
// Check if user is logged in
const { createClient } = await import('@/lib/supabase/client');
const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();
console.log('User:', user ? user.email : 'Not logged in');
```

## Expected Results

✅ **If favorites work:**

- LocalStorage has favorites array with items
- Supabase tables exist
- User is logged in
- Favorites appear in catalogue after sync

❌ **If favorites don't work:**

- Missing Supabase tables → Run migration
- User not logged in → Favorites only in localStorage
- LocalStorage has favorites but Supabase is empty → Sync issue



