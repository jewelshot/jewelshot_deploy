/**
 * Bundle Analyzer Configuration
 * Run: ANALYZE=true npm run build
 */

import withBundleAnalyzer from '@next/bundle-analyzer';
import baseConfig from './next.config';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

export default bundleAnalyzer(baseConfig);
