import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@shopnearby/theme",
    "@shopnearby/types",
    "@shopnearby/validation",
    "@shopnearby/sdk",
    "@shopnearby/utils",
  ],
};

export default nextConfig;
