import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Pin the workspace root (a stray lockfile in the home directory confuses inference).
const root = process.cwd();

const nextConfig: NextConfig = {
  turbopack: { root },
  outputFileTracingRoot: root,
  typedRoutes: false,
  poweredByHeader: false,
  // Tailwind is atomic and most visitors are first-time: inline CSS removes a render-blocking request.
  experimental: { inlineCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The Studio is embedded in the Presentation tool iframe from the same origin only.
      { source: "/((?!studio).*)", headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }] },
    ];
  },
  async redirects() {
    // Keep historical URLs alive.
    return [
      { source: "/dexterix-5", destination: "/dexterix/dexterix-5-0", permanent: true },
      { source: "/achievements", destination: "/about", permanent: true },
      { source: "/gallery", destination: "/community", permanent: true },
      { source: "/contact", destination: "/collaborate", permanent: true },
    ];
  },
};

export default nextConfig;
