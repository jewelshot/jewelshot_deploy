'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, X, Loader2, ExternalLink } from 'lucide-react';

export default function SetupPage() {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<{
    tablesExist?: boolean;
    message?: string;
    instructions?: string[];
  } | null>(null);

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
      } else {
        toast.error('❌ Migration needed');
      }
    } catch (error) {
      toast.error('Failed to check migration status');
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-black to-black p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-purple-500/20 bg-black/60 p-8 backdrop-blur-xl">
        <h1 className="mb-2 text-3xl font-bold text-white">
          🛠️ Database Setup
        </h1>
        <p className="mb-8 text-white/60">
          Check if batch processing tables exist
        </p>

        <div className="mb-6 space-y-4">
          <Button
            onClick={checkMigration}
            disabled={checking}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {checking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Database Status'
            )}
          </Button>
        </div>

        {status && (
          <div className="space-y-4">
            {/* Status Badge */}
            <div
              className={`flex items-center gap-3 rounded-lg border p-4 ${
                status.tablesExist
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/10'
              }`}
            >
              {status.tablesExist ? (
                <>
                  <Check className="h-6 w-6 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-400">
                      ✅ Database Ready!
                    </p>
                    <p className="text-sm text-green-400/70">
                      All tables are set up correctly.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <X className="h-6 w-6 flex-shrink-0 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-400">
                      ❌ Migration Required
                    </p>
                    <p className="text-sm text-red-400/70">{status.message}</p>
                  </div>
                </>
              )}
            </div>

            {/* Instructions */}
            {!status.tablesExist && status.instructions && (
              <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                <h3 className="mb-3 font-semibold text-purple-400">
                  📋 Migration Steps:
                </h3>
                <ol className="space-y-2 text-sm text-white/70">
                  {status.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-mono text-purple-400">
                        {index + 1}.
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-3">
                  <p className="text-xs text-yellow-400">
                    <strong>📄 Migration File:</strong>
                    <br />
                    <code className="font-mono">
                      supabase/migrations/20250118_batch_projects.sql
                    </code>
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => {
                      window.open('https://supabase.com/dashboard', '_blank');
                    }}
                    variant="outline"
                    className="flex-1 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Supabase Dashboard
                  </Button>
                </div>
              </div>
            )}

            {/* Success Actions */}
            {status.tablesExist && (
              <div className="flex gap-2">
                <Button
                  onClick={() => (window.location.href = '/batch')}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Go to Batch Page
                </Button>
                <Button
                  onClick={() => (window.location.href = '/gallery')}
                  variant="outline"
                  className="flex-1 border-purple-500/30"
                >
                  Go to Gallery
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Debug Info */}
        {status && !status.tablesExist && (
          <div className="mt-6 rounded border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-xs font-semibold text-white/50">
              DEBUG INFO:
            </p>
            <pre className="overflow-x-auto text-xs text-white/40">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

