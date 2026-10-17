import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow tunnel domains and local network origins */
  allowedDevOrigins: [
    "unzip-dominoes-powwow.ngrok-free.dev",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
    "*.trycloudflare.com",
    "*.loca.lt",
    "192.168.227.201:3000",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "unzip-dominoes-powwow.ngrok-free.dev",
        "*.ngrok-free.dev",
        "*.ngrok.app",
        "*.ngrok.io",
        "*.trycloudflare.com",
        "*.loca.lt",
        "192.168.227.201:3000",
        "localhost:3000",
      ],
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
