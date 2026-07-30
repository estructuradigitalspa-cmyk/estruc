import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.estructuradigital.cl" }],
        destination: "https://estructuradigital.cl/:path*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;