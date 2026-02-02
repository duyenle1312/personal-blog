import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    '/posts/[slug]': ['./outstatic/**/*'],
    '/gallery': ['./outstatic/content/imageposts/*'],
  },

    images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
