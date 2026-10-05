import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keep Turbopack scoped to this repository when parent directories contain lockfiles.
  turbopack: {
    root: process.cwd(),
  },
  // Ensure optional server-only dependencies such as the MongoDB driver are resolved from
  // the Node.js environment at runtime instead of being eagerly bundled during builds.
  serverExternalPackages: ["mongodb"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
