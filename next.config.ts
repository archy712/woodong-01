import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          new URL(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/**`,
          ),
        ]
      : [],
  },
};

export default nextConfig;
