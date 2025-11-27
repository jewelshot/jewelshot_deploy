'use client';

/**
 * API Documentation Page
 * 
 * Interactive API documentation using Swagger UI
 */

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Jewelshot API Documentation</h1>
          <p className="text-lg opacity-90">
            Complete API reference for developers
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex gap-4 text-sm">
          <a 
            href="#authentication" 
            className="text-blue-600 hover:underline"
          >
            Authentication
          </a>
          <a 
            href="#rate-limits" 
            className="text-blue-600 hover:underline"
          >
            Rate Limits
          </a>
          <a 
            href="#errors" 
            className="text-blue-600 hover:underline"
          >
            Error Codes
          </a>
          <a 
            href="/docs/examples" 
            className="text-blue-600 hover:underline"
          >
            Code Examples
          </a>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="max-w-7xl mx-auto p-8">
        <SwaggerUI url="/openapi.yaml" />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-8 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@jewelshot.ai" 
              className="text-blue-600 hover:underline"
            >
              support@jewelshot.ai
            </a>
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/docs/quickstart" className="hover:text-blue-600">
              Quick Start
            </a>
            <a href="/docs/guides" className="hover:text-blue-600">
              Guides
            </a>
            <a href="/docs/changelog" className="hover:text-blue-600">
              Changelog
            </a>
            <a href="https://github.com/jewelshot" className="hover:text-blue-600">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

