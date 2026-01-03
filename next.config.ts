import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // <--- ADD THIS LINE
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;