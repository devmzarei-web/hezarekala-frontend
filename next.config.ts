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
        hostname: "cms.hezarehkala.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hezarehkala.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.hezarehkala.ir",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;