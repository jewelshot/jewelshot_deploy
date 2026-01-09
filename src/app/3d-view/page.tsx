'use client';

import dynamic from 'next/dynamic';
import { Component, ReactNode } from 'react';
import { useNoScroll } from '@/hooks/useNoScroll';

// Dynamic import to avoid SSR issues with Three.js
const ThreeDViewContent = dynamic(
  () => import('@/components/organisms/ThreeDViewContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80 mx-auto" />
          <p className="text-sm text-white/60">Loading 3D Viewer...</p>
        </div>
      </div>
    )
  }
);

// Simple Error Boundary for 3D Viewer
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ThreeDErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Viewer Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-black">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-4 h-12 w-12 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">3D Viewer Error</h2>
            <p className="text-white/60 text-sm mb-4">
              {this.state.error?.message || 'Failed to load 3D viewer. This might be due to WebGL not being supported or a network issue.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Try Again
              </button>
              <p className="text-white/40 text-xs">
                If the problem persists, try refreshing the page or using a different browser.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ThreeDViewPage() {
  useNoScroll();
  
  return (
    <ThreeDErrorBoundary>
      <ThreeDViewContent />
    </ThreeDErrorBoundary>
  );
}

