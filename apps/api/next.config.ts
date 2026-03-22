import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nss/db", "@nss/validators", "@nss/config"],
};

export default nextConfig;
