import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All imagery is locally generated SVG served from /api/placeholder —
  // the default image optimizer adds nothing for SVG, so plain <img> is
  // used for product art and next/image is bypassed intentionally.
};

export default nextConfig;
