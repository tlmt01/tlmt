import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@react-pdf/renderer", "@msg91comm/sendotp-sdk"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
    unoptimized: true, // disables Image Optimization API
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // or whatever limit you want
    },
  },
  output: "standalone",
};

export default nextConfig;
