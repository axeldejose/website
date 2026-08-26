import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 301 heredado del WordPress anterior. /m era la landing que Axel repartió
  // en su bio de TikTok e Instagram — si este redirect se rompe, se rompe su
  // único canal de captación.
  async redirects() {
    return [
      {
        source: "/m",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
