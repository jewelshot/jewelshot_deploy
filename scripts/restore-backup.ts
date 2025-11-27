/**
 * Database Restore Script
 * 
 * Restores database from JSON backup
 * Usage: npx tsx scripts/restore-backup.ts <backup-file-name>
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function restoreBackup(backupFileName: string) {
  console.log(`🔄 Starting restore from: ${backupFileName}`);
  
  try {
    // Download backup from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('backups')
      .download(`daily/${backupFileName}`);

    if (downloadError) {
      throw new Error(`Failed to download backup: ${downloadError.message}`);
    }

    // Parse backup data
    const backupText = await fileData.text();
    const backup = JSON.parse(backupText);

    console.log(`📦 Backup version: ${backup.version}`);
    console.log(`📅 Backup date: ${backup.timestamp}`);
    console.log(`📊 Tables in backup: ${Object.keys(backup.tables).join(', ')}`);

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will overwrite existing data!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Restore each table
    for (const [tableName, rows] of Object.entries(backup.tables)) {
      console.log(`\n🔄 Restoring ${tableName}...`);
      const rowsArray = rows as any[];
      
      if (rowsArray.length === 0) {
        console.log(`  ⚠️  No data to restore for ${tableName}`);
        continue;
      }

      // Delete existing data (optional - comment out if you want to merge)
      // const { error: deleteError } = await supabase
      //   .from(tableName)
      //   .delete()
      //   .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      // Insert backup data
      const { error: insertError } = await supabase
        .from(tableName)
        .upsert(rowsArray, { onConflict: 'id' });

      if (insertError) {
        console.error(`  ❌ Failed to restore ${tableName}: ${insertError.message}`);
      } else {
        console.log(`  ✅ Restored ${rowsArray.length} rows to ${tableName}`);
      }
    }

    console.log('\n✅ Restore completed successfully!');

  } catch (error: any) {
    console.error('\n❌ Restore failed:', error.message);
    process.exit(1);
  }
}

// Main
const backupFileName = process.argv[2];

if (!backupFileName) {
  console.error('Usage: npx tsx scripts/restore-backup.ts <backup-file-name>');
  console.error('Example: npx tsx scripts/restore-backup.ts backup_abc123_2024-01-27.sql.json');
  process.exit(1);
}

restoreBackup(backupFileName);

