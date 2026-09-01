import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  staticPageGenerationTimeout: 120,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hezarehkala.ir",
      },
      {
        protocol: "https",
        hostname: "www.hezarehkala.ir",
      },
      {
        protocol: "https",
        hostname: "cms.hezarehkala.ir",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;