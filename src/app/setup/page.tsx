'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, X, Loader2, Copy, CheckCheck } from 'lucide-react';

const MIGRATION_SQL = `-- Batch Projects ve Images tabloları
-- Her batch işlemi bir project, her generate edilen görsel bir image

-- Batch Projects tablosu
CREATE TABLE IF NOT EXISTS public.batch_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    total_images INTEGER NOT NULL DEFAULT 0,
    completed_images INTEGER NOT NULL DEFAULT 0,
    failed_images INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT batch_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Batch Images tablosu
CREATE TABLE IF NOT EXISTS public.batch_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_project_id UUID NOT NULL REFERENCES public.batch_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    original_filename TEXT NOT NULL,
    original_size INTEGER NOT NULL,
    storage_path TEXT,
    result_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT batch_images_batch_project_id_fkey FOREIGN KEY (batch_project_id) REFERENCES public.batch_projects(id) ON DELETE CASCADE,
    CONSTRAINT batch_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_batch_projects_user_id ON public.batch_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_projects_created_at ON public.batch_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_batch_images_batch_project_id ON public.batch_images(batch_project_id);
CREATE INDEX IF NOT EXISTS idx_batch_images_user_id ON public.batch_images(user_id);

-- RLS Policies
ALTER TABLE public.batch_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_images ENABLE ROW LEVEL SECURITY;

-- Users can only see their own batch projects
CREATE POLICY "Users can view own batch projects" ON public.batch_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own batch projects" ON public.batch_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own batch projects" ON public.batch_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own batch projects" ON public.batch_projects FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own batch images
CREATE POLICY "Users can view own batch images" ON public.batch_images FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own batch images" ON public.batch_images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own batch images" ON public.batch_images FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own batch images" ON public.batch_images FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_batch_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER batch_projects_updated_at
    BEFORE UPDATE ON public.batch_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_batch_projects_updated_at();

-- Function to update project stats when image status changes
CREATE OR REPLACE FUNCTION update_batch_project_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.batch_projects
    SET 
        completed_images = (
            SELECT COUNT(*) 
            FROM public.batch_images 
            WHERE batch_project_id = NEW.batch_project_id 
            AND status = 'completed'
        ),
        failed_images = (
            SELECT COUNT(*) 
            FROM public.batch_images 
            WHERE batch_project_id = NEW.batch_project_id 
            AND status = 'failed'
        ),
        status = CASE 
            WHEN (SELECT COUNT(*) FROM public.batch_images WHERE batch_project_id = NEW.batch_project_id AND status IN ('completed', 'failed')) = 
                 (SELECT total_images FROM public.batch_projects WHERE id = NEW.batch_project_id)
            THEN 'completed'
            ELSE 'processing'
        END
    WHERE id = NEW.batch_project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER batch_images_update_stats
    AFTER INSERT OR UPDATE ON public.batch_images
    FOR EACH ROW
    EXECUTE FUNCTION update_batch_project_stats();`;

export default function SetupPage() {
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{
    tablesExist?: boolean;
    message?: string;
  } | null>(null);

  // Auto-check on mount
  useEffect(() => {
    checkMigration();
  }, []);

  const checkMigration = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/setup/migrate', {
        method: 'POST',
      });
      const data = await response.json();
      setStatus(data);

      if (data.tablesExist) {
        toast.success('✅ Database is ready!');
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/batch';
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to check migration status');
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  const copyMigrationSQL = () => {
    navigator.clipboard.writeText(MIGRATION_SQL);
    setCopied(true);
    toast.success('📋 Migration SQL copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const openSupabaseDashboard = () => {
    // Try to get project URL from env or use generic dashboard
    window.open('https://supabase.com/dashboard/project/_/sql/new', '_blank');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-black to-black p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-purple-500/20 bg-black/60 p-8 backdrop-blur-xl">
        <h1 className="mb-2 text-3xl font-bold text-white">
          🛠️ Database Setup
        </h1>
        <p className="mb-8 text-white/60">
          Batch processing için veritabanı tablolarını oluşturalım
        </p>

        {checking ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            <span className="ml-4 text-lg text-white/70">
              Veritabanı kontrol ediliyor...
            </span>
          </div>
        ) : status?.tablesExist ? (
          // ✅ SUCCESS STATE
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-lg border border-green-500/30 bg-green-500/10 p-6">
              <CheckCheck className="h-12 w-12 flex-shrink-0 text-green-500" />
              <div>
                <p className="text-xl font-semibold text-green-400">
                  ✅ Veritabanı Hazır!
                </p>
                <p className="text-sm text-green-400/70">
                  Tüm tablolar başarıyla oluşturuldu. Batch sayfasına
                  yönlendiriliyorsunuz...
                </p>
              </div>
            </div>

            <Button
              onClick={() => (window.location.href = '/batch')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              🚀 Batch Sayfasına Git
            </Button>
          </div>
        ) : (
          // ❌ MIGRATION NEEDED STATE
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
              <X className="h-12 w-12 flex-shrink-0 text-red-500" />
              <div>
                <p className="text-xl font-semibold text-red-400">
                  ⚠️ Migration Gerekli
                </p>
                <p className="text-sm text-red-400/70">
                  Batch processing için tablolar henüz oluşturulmamış.
                </p>
              </div>
            </div>

            {/* STEP BY STEP GUIDE */}
            <div className="space-y-4 rounded-lg border border-purple-500/20 bg-purple-500/5 p-6">
              <h3 className="text-lg font-semibold text-purple-400">
                📋 3 Kolay Adımda Kurulum:
              </h3>

              {/* STEP 1 */}
              <div className="rounded-lg border border-purple-500/20 bg-black/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold">
                    1
                  </span>
                  <span className="font-semibold text-white">
                    Migration SQL'i Kopyala
                  </span>
                </div>
                <Button
                  onClick={copyMigrationSQL}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      SQL Kodunu Kopyala
                    </>
                  )}
                </Button>
              </div>

              {/* STEP 2 */}
              <div className="rounded-lg border border-purple-500/20 bg-black/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold">
                    2
                  </span>
                  <span className="font-semibold text-white">
                    Supabase SQL Editor'ı Aç
                  </span>
                </div>
                <Button
                  onClick={openSupabaseDashboard}
                  variant="outline"
                  className="w-full border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20"
                >
                  🔗 Supabase Dashboard'u Aç
                </Button>
                <p className="mt-2 text-xs text-white/50">
                  Dashboard açıldığında: SQL Editor → New Query
                </p>
              </div>

              {/* STEP 3 */}
              <div className="rounded-lg border border-purple-500/20 bg-black/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold">
                    3
                  </span>
                  <span className="font-semibold text-white">
                    Yapıştır ve Çalıştır
                  </span>
                </div>
                <ol className="space-y-1 text-sm text-white/70">
                  <li>• Kopyaladığın SQL'i yapıştır</li>
                  <li>• "RUN" butonuna bas</li>
                  <li>• ✅ Success mesajını gör</li>
                  <li>• Bu sayfaya geri dön</li>
                </ol>
              </div>

              {/* RECHECK BUTTON */}
              <Button
                onClick={checkMigration}
                disabled={checking}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {checking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kontrol Ediliyor...
                  </>
                ) : (
                  '🔄 Tekrar Kontrol Et'
                )}
              </Button>
            </div>

            {/* VIDEO TUTORIAL PLACEHOLDER */}
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
              <p className="text-sm text-yellow-400">
                💡 <strong>İpucu:</strong> Migration sadece bir kez
                çalıştırılır. Sonraki ziyaretlerde bu sayfayı görmeyeceksin.
              </p>
            </div>

            {/* SQL PREVIEW */}
            <details className="rounded-lg border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-sm font-medium text-white/70 hover:text-white">
                📄 SQL Preview (Görmek için tıkla)
              </summary>
              <pre className="mt-4 max-h-64 overflow-auto rounded bg-black/60 p-4 text-xs text-white/60">
                {MIGRATION_SQL}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
