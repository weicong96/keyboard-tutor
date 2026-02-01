import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16 default)
  turbopack: {},
  
  // Webpack config for native modules (fallback if not using Turbopack)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle native modules for server-side
      config.externals = [...(config.externals || []), 'better-sqlite3'];
    }
    return config;
  },
};

export default nextConfig;
