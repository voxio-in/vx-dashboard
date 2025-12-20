import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // Empty config to silence warnings
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude voxioagent from server-side bundle
      config.externals = config.externals || [];
      config.externals.push("voxioagent");
    }
    return config;
  },
  // Alternative: Mark voxioagent as external for server
  experimental: {
    serverComponentsExternalPackages: ["voxioagent"],
  },
};

export default nextConfig;
