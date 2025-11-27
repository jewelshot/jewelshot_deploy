-- ============================================
-- PERFORMANCE INDEXES
-- ============================================
-- Adds critical indexes for query performance
-- Run this migration to improve database query speed

-- ============================================
-- 1. USER CREDITS INDEXES
-- ============================================

-- Index for fast user credit lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id 
ON user_credits(user_id);

-- Index for finding users with low credits
CREATE INDEX IF NOT EXISTS idx_user_credits_balance 
ON user_credits(balance) 
WHERE balance < 10;

-- ============================================
-- 2. CREDIT TRANSACTIONS INDEXES
-- ============================================

-- Index for user transaction history
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id 
ON credit_transactions(user_id);

-- Index for job-related transactions
CREATE INDEX IF NOT EXISTS idx_credit_transactions_job_id 
ON credit_transactions(job_id) 
WHERE job_id IS NOT NULL;

-- Index for pending/reserved transactions
CREATE INDEX IF NOT EXISTS idx_credit_transactions_status 
ON credit_transactions(status) 
WHERE status = 'reserved';

-- Composite index for user + created_at (for pagination)
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created 
ON credit_transactions(user_id, created_at DESC);

-- ============================================
-- 3. BATCH PROJECTS INDEXES
-- ============================================

-- Index for user's batch projects
CREATE INDEX IF NOT EXISTS idx_batch_projects_user_id 
ON batch_projects(user_id);

-- Index for active batches
CREATE INDEX IF NOT EXISTS idx_batch_projects_status 
ON batch_projects(status);

-- Composite index for user + created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_batch_projects_user_created 
ON batch_projects(user_id, created_at DESC);

-- ============================================
-- 4. BATCH IMAGES INDEXES
-- ============================================

-- Index for batch images by project
CREATE INDEX IF NOT EXISTS idx_batch_images_project_id 
ON batch_images(batch_project_id);

-- Index for pending images (for background processing)
CREATE INDEX IF NOT EXISTS idx_batch_images_pending 
ON batch_images(batch_project_id, status) 
WHERE status = 'pending';

-- Index for failed images (for retry logic)
CREATE INDEX IF NOT EXISTS idx_batch_images_failed 
ON batch_images(batch_project_id, status) 
WHERE status = 'failed';

-- Composite index for project + created_at
CREATE INDEX IF NOT EXISTS idx_batch_images_project_created 
ON batch_images(batch_project_id, created_at ASC);

-- ============================================
-- 5. IMAGES TABLE INDEXES (if exists)
-- ============================================

-- Check if images table exists before creating indexes
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'images') THEN
    -- Index for user's images
    CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
    
    -- Index for recent images
    CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);
    
    -- Composite index for user + created_at
    CREATE INDEX IF NOT EXISTS idx_images_user_created ON images(user_id, created_at DESC);
  END IF;
END $$;

-- ============================================
-- ANALYZE TABLES
-- ============================================
-- Update table statistics for query planner

ANALYZE user_credits;
ANALYZE credit_transactions;
ANALYZE batch_projects;
ANALYZE batch_images;

