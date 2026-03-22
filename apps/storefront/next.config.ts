import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nss/ui", "@nss/db", "@nss/auth", "@nss/validators", "@nss/config"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@nss/ui"],
  },
};

export default nextConfig;
