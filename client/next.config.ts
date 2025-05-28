import type { NextConfig } from "next";

const nextConfig: NextConfig = {
reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // <--- ignora erros do ESLint no build
  },
};

export default nextConfig;
