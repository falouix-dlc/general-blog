
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //output: 'export', // Add this for static HTML export
  //distDir: 'dist',  // Output folder name
  images: {
    unoptimized: true, // Required for static export
  },
  typescript: {
    ignoreBuildErrors: true, // Temporary fix
  },
};

export default nextConfig;