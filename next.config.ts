import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ignora erros de lint no build
  },
  typescript: {
    ignoreBuildErrors: true, // ignora erros de type checking no build
  },
};

export default nextConfig;
