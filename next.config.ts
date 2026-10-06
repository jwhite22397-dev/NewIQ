import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // `next dev` allows localhost only. Other hostnames, including 127.0.0.1 and
  // the cloud preview host, are blocked from dev assets. The quiz then stays
  // on its loading state because the client runtime never finishes starting.
  allowedDevOrigins: ["127.0.0.1", "*.agent.cvm.dev"],
};

export default nextConfig;
