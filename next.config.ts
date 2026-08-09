import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    // Rust MDX compiler — required for MDX under Turbopack.
    mdxRs: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
