import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to avoid Windows symlink privilege issues
  // turbopack: {}, // Commented out
};

export default nextConfig;
