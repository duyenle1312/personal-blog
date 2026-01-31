import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: { '/posts/[slug]': ['./outstatic/**/*'], },
};

export default nextConfig;
