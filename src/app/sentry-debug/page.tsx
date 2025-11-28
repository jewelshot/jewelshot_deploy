'use client';

/**
 * Sentry Debug Page
 * 
 * Comprehensive diagnostics for Sentry integration
 */

import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function SentryDebugPage() {
  const [diagnostics, setDiagnostics] = useState({
    dsnInCode: '',
    dsnInEnv: '',
    sentryLoaded: false,
    sentryGlobal: false,
    nodeEnv: '',
    networkTest: { status: 'pending', message: '' },
    cspErrors: [] as string[],
    consoleErrors: [] as string[],
  });

  useEffect(() => {
    // Get DSN from different sources
    const dsnInCode = 'https://a0e9eb5609a4567d13d8f7dbb911c418@o4510311307149312.ingest.de.sentry.io/4510439628996688';
    const dsnInEnv = process.env.NEXT_PUBLIC_SENTRY_DSN || 'NOT SET';
    const sentryLoaded = typeof Sentry !== 'undefined';
    const sentryGlobal = typeof window !== 'undefined' && !!(window as any).Sentry;
    const nodeEnv = process.env.NODE_ENV || 'unknown';

    // Capture console errors
    const originalError = console.error;
    const capturedErrors: string[] = [];
    
    console.error = (...args) => {
      capturedErrors.push(args.join(' '));
      originalError.apply(console, args);
    };

    // Test network connectivity to Sentry
    const testSentryNetwork = async () => {
      try {
        // Try to reach Sentry's health endpoint
        const response = await fetch('https://o4510311307149312.ingest.de.sentry.io/api/embed/error-page/', {
          method: 'HEAD',
          mode: 'no-cors', // Avoid CORS issues
        });
        
        setDiagnostics(prev => ({
          ...prev,
          networkTest: { 
            status: 'success', 
            message: 'Network request completed (no-cors mode)' 
          }
        }));
      } catch (error: any) {
        setDiagnostics(prev => ({
          ...prev,
          networkTest: { 
            status: 'error', 
            message: error.message || 'Network request failed' 
          }
        }));
      }
    };

    setDiagnostics({
      dsnInCode,
      dsnInEnv,
      sentryLoaded,
      sentryGlobal,
      nodeEnv,
      networkTest: diagnostics.networkTest,
      cspErrors: [],
      consoleErrors: capturedErrors,
    });

    testSentryNetwork();

    // Cleanup
    return () => {
      console.error = originalError;
    };
  }, []);

  const testError = () => {
    try {
      Sentry.captureException(new Error('🧪 Sentry Debug Test Error'));
      alert('✅ Error sent to Sentry! Check console and Sentry dashboard.');
    } catch (error: any) {
      alert('❌ Failed to send error: ' + error.message);
    }
  };

  const testThrow = () => {
    throw new Error('🔥 Thrown error for Sentry');
  };

  const checkCSP = () => {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const cspHeader = cspMeta?.getAttribute('content') || 'Not set in meta tag';
    
    return {
      inMeta: !!cspMeta,
      content: cspHeader,
    };
  };

  const testNetworkRequest = async () => {
    try {
      // Simulate a Sentry request
      const response = await fetch('https://o4510311307149312.ingest.de.sentry.io/api/1/envelope/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' }),
      });
      
      console.log('Network test response:', response.status);
      alert(`Network test: ${response.status}`);
    } catch (error: any) {
      console.error('Network test failed:', error);
      alert(`Network test failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Sentry Debug Dashboard</h1>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Sentry Loaded */}
          <div className={`p-4 rounded-lg ${diagnostics.sentryLoaded ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border-2`}>
            <h3 className="font-semibold mb-2">Sentry Module</h3>
            <p className="text-2xl">{diagnostics.sentryLoaded ? '✅ Loaded' : '❌ Not Loaded'}</p>
          </div>

          {/* Node ENV */}
          <div className={`p-4 rounded-lg ${diagnostics.nodeEnv === 'production' ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'} border-2`}>
            <h3 className="font-semibold mb-2">Environment</h3>
            <p className="text-2xl font-mono">{diagnostics.nodeEnv}</p>
            <p className="text-xs mt-1">
              {diagnostics.nodeEnv === 'production' ? '✅ Sentry enabled' : '⚠️ Sentry disabled in dev'}
            </p>
          </div>

          {/* DSN Comparison */}
          <div className="p-4 rounded-lg bg-blue-100 border-blue-300 border-2 md:col-span-2">
            <h3 className="font-semibold mb-3">DSN Configuration</h3>
            
            <div className="space-y-2 text-sm font-mono">
              <div>
                <strong>Expected (in code):</strong>
                <p className="bg-white p-2 rounded mt-1 break-all text-xs">
                  {diagnostics.dsnInCode}
                </p>
              </div>
              
              <div>
                <strong>Actual (from env):</strong>
                <p className={`p-2 rounded mt-1 break-all text-xs ${diagnostics.dsnInEnv === diagnostics.dsnInCode ? 'bg-green-200' : 'bg-red-200'}`}>
                  {diagnostics.dsnInEnv}
                </p>
              </div>
              
              <div className="pt-2">
                {diagnostics.dsnInEnv === diagnostics.dsnInCode ? (
                  <span className="text-green-700 font-semibold">✅ DSN Match!</span>
                ) : (
                  <span className="text-red-700 font-semibold">❌ DSN Mismatch! Check Vercel env vars.</span>
                )}
              </div>
            </div>
          </div>

          {/* Network Test */}
          <div className={`p-4 rounded-lg border-2 ${
            diagnostics.networkTest.status === 'success' ? 'bg-green-100 border-green-300' :
            diagnostics.networkTest.status === 'error' ? 'bg-red-100 border-red-300' :
            'bg-gray-100 border-gray-300'
          }`}>
            <h3 className="font-semibold mb-2">Network Test</h3>
            <p className="text-sm">{diagnostics.networkTest.message || 'Testing...'}</p>
          </div>

          {/* Global Window Check */}
          <div className={`p-4 rounded-lg ${diagnostics.sentryGlobal ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'} border-2`}>
            <h3 className="font-semibold mb-2">window.Sentry</h3>
            <p className="text-2xl">{diagnostics.sentryGlobal ? '✅ Available' : '⚠️ Not Global'}</p>
            <p className="text-xs mt-1">
              {diagnostics.sentryGlobal ? 'Can use window.Sentry' : 'Must import @sentry/nextjs'}
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Test Sentry</h2>
          
          <div className="space-y-3">
            <button
              onClick={testError}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              1. Test Sentry.captureException()
            </button>

            <button
              onClick={testThrow}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              2. Test throw new Error()
            </button>

            <button
              onClick={testNetworkRequest}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              3. Test Direct Network Request
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>⚠️ Note:</strong> After clicking, check:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Browser Console (for error logs)</li>
              <li>Network tab (for Sentry requests)</li>
              <li>Sentry Dashboard (https://jewelshot.sentry.io/issues/)</li>
            </ul>
          </div>
        </div>

        {/* Console Output Monitor */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📝 Live Console Monitor</h2>
          <p className="text-sm text-gray-600 mb-3">
            Open browser console (Cmd+Opt+J) and watch for errors. Check Network tab for blocked requests.
          </p>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-64">
            <div>// Expected in console:</div>
            <div className="text-blue-400">→ [Sentry] Client initialized</div>
            <div className="text-yellow-400">→ No CSP violations</div>
            <div className="text-green-400">→ No network blocks</div>
            <div className="mt-3">// If you see:</div>
            <div className="text-red-400">→ "Failed to load resource" → Network blocked</div>
            <div className="text-red-400">→ "CSP violation" → CSP blocking Sentry</div>
            <div className="text-red-400">→ "ERR_CERT_COMMON_NAME_INVALID" → Wrong DSN/domain</div>
          </div>
        </div>

        {/* Network Tab Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🌐 Network Tab Check</h2>
          
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <div>
                <strong>Open Network Tab</strong> (Cmd+Opt+J → Network)
              </div>
            </li>
            
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <div>
                <strong>Click a test button above</strong>
              </div>
            </li>
            
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <div>
                <strong>Look for requests to:</strong>
                <code className="block bg-gray-100 p-2 rounded mt-1 text-xs break-all">
                  o4510311307149312.ingest.de.sentry.io
                </code>
              </div>
            </li>
            
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <div>
                <strong>Check status:</strong>
                <ul className="mt-1 space-y-1">
                  <li>✅ <span className="text-green-600">200/204</span> → Success!</li>
                  <li>❌ <span className="text-red-600">Failed/Blocked</span> → CSP or ad-blocker</li>
                  <li>❌ <span className="text-red-600">404/403</span> → Wrong DSN</li>
                  <li>❌ <span className="text-red-600">CERT error</span> → Old/wrong domain</li>
                </ul>
              </div>
            </li>
          </ol>
        </div>

        {/* Current Issues Detected */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">⚠️ Detected Issues</h2>
          
          <div className="space-y-3">
            {/* DSN Check */}
            {diagnostics.dsnInEnv !== diagnostics.dsnInCode && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-800 mb-1">❌ DSN Mismatch</h3>
                <p className="text-sm text-red-700">
                  Environment DSN doesn't match expected DSN. Clear Vercel cache and redeploy.
                </p>
              </div>
            )}

            {/* Environment Check */}
            {diagnostics.nodeEnv !== 'production' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-semibold text-yellow-800 mb-1">⚠️ Not in Production</h3>
                <p className="text-sm text-yellow-700">
                  Sentry is disabled in development. Test on production URL (www.jewelshot.ai).
                </p>
              </div>
            )}

            {/* Sentry Not Global */}
            {!diagnostics.sentryGlobal && diagnostics.sentryLoaded && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-blue-800 mb-1">ℹ️ window.Sentry Not Available</h3>
                <p className="text-sm text-blue-700">
                  Sentry is loaded but not attached to window. Use import instead of window.Sentry.
                </p>
              </div>
            )}

            {/* All Good */}
            {diagnostics.dsnInEnv === diagnostics.dsnInCode && 
             diagnostics.nodeEnv === 'production' && 
             diagnostics.sentryLoaded && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold text-green-800 mb-1">✅ Everything Looks Good!</h3>
                <p className="text-sm text-green-700">
                  Click test buttons and check Sentry dashboard for errors.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Raw Diagnostics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">🔍 Raw Diagnostics</h2>
          
          <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-auto">
            <pre>{JSON.stringify(diagnostics, null, 2)}</pre>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <button
              onClick={() => {
                console.log('=== SENTRY DEBUG ===');
                console.log('Diagnostics:', diagnostics);
                console.log('Sentry object:', Sentry);
                console.log('window.Sentry:', (window as any).Sentry);
                console.log('ENV DSN:', process.env.NEXT_PUBLIC_SENTRY_DSN);
                alert('✅ Logged to console!');
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Log Full Debug Info to Console
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">📋 Troubleshooting Steps</h2>
          
          <ol className="space-y-3 text-sm">
            <li>
              <strong>1. Check Console</strong> - Look for "[Sentry] Client initialized"
            </li>
            <li>
              <strong>2. Check Network Tab</strong> - Filter by "sentry.io", look for requests
            </li>
            <li>
              <strong>3. Check for Blocks</strong> - Red requests = blocked (CSP or ad-blocker)
            </li>
            <li>
              <strong>4. Disable Ad-Blocker</strong> - Temporarily disable and retry
            </li>
            <li>
              <strong>5. Check Vercel Env Vars</strong> - Ensure NEXT_PUBLIC_SENTRY_DSN matches above
            </li>
            <li>
              <strong>6. Clear Cache</strong> - Delete + re-add env var in Vercel, redeploy
            </li>
          </ol>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-x-4 text-sm">
          <a 
            href="https://jewelshot.sentry.io/issues/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            → Sentry Dashboard
          </a>
          <a 
            href="/sentry-example-page" 
            className="text-blue-600 hover:underline"
          >
            → Official Test Page
          </a>
          <a 
            href="/" 
            className="text-blue-600 hover:underline"
          >
            → Home
          </a>
        </div>
      </div>
    </div>
  );
}

