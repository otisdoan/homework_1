import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // cho phép mọi domain https
      },
      {
        protocol: "http",
        hostname: "**", // cho phép luôn http (nếu cần)
      },
    ],
  },
};

export default nextConfig;
