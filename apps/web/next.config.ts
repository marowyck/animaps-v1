import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Include retina widths for large clay figures (~560–720 CSS px)
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [64, 96, 128, 160, 256, 384, 512, 640],
    qualities: [75, 92, 100],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Avoid shipping unused heavy client graphs in prod
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap", "@gsap/react"],
  },
};

export default nextConfig;
