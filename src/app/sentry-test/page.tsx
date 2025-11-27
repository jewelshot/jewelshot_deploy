'use client';

/**
 * Sentry Test Page
 * 
 * Test if Sentry error tracking is working
 */

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function SentryTestPage() {
  const [result, setResult] = useState('');

  const testClientError = () => {
    try {
      // @ts-ignore - Intentional error
      nonExistentFunction();
    } catch (error) {
      Sentry.captureException(error);
      setResult('✅ Client error sent to Sentry! Check your Sentry dashboard.');
    }
  };

  const testManualError = () => {
    const error = new Error('Manual test error from Sentry test page');
    Sentry.captureException(error);
    setResult('✅ Manual error sent to Sentry! Check your Sentry dashboard.');
  };

  const testMessageCapture = () => {
    Sentry.captureMessage('Test message from Jewelshot', 'info');
    setResult('✅ Message sent to Sentry! Check your Sentry dashboard.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Sentry Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Error Tracking</h2>
            <p className="text-gray-600 mb-6">
              Click any button below to send a test error to Sentry.
              Then check your Sentry dashboard at: 
              <a 
                href="https://jewelshot.sentry.io/issues/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-2"
              >
                https://jewelshot.sentry.io/issues/
              </a>
            </p>
          </div>

          {/* Test Buttons */}
          <div className="space-y-3">
            <button
              onClick={testClientError}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              1. Test Client Error (undefined function)
            </button>

            <button
              onClick={testManualError}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              2. Test Manual Error (new Error())
            </button>

            <button
              onClick={testMessageCapture}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              3. Test Message Capture
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{result}</p>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Expected Behavior:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>In development: Errors logged to console only</li>
              <li>In production: Errors sent to Sentry</li>
              <li>Check Sentry dashboard for new issues</li>
              <li>Issues should appear within 10 seconds</li>
            </ul>
          </div>

          {/* Environment Info */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Environment Info:</h3>
            <p className="text-sm text-gray-700">
              NODE_ENV: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{process.env.NODE_ENV}</span>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Sentry DSN: <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_SENTRY_DSN ? '✅ Set' : '❌ Not Set'}
              </span>
            </p>
            {!process.env.NEXT_PUBLIC_SENTRY_DSN && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ NEXT_PUBLIC_SENTRY_DSN not set! Add to .env.local
              </p>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

