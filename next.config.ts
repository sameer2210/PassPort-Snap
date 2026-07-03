import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

// Intercept fetch requests during build-time to mock Google Fonts offline
const originalFetch = globalThis.fetch;
globalThis.fetch = async function (
  this: unknown,
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.href
      : (input as Request)?.url;

  if (url && (url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com"))) {
    // Return a local font fallback CSS to satisfy the Next.js compiler offline
    return new Response(
      `@font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: local('Inter'), local('Arial'), sans-serif;
      }`,
      {
        status: 200,
        headers: { "content-type": "text/css" },
      }
    );
  }
  return originalFetch.call(this, input, init);
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  turbopack: {},
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
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
