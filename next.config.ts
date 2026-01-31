import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: { '/articles/[slug]': ['./outstatic/**/*'], },
};

export default nextConfig;
