/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript and ESLint checks
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Add this to ensure proper hydration
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  }
}

module.exports = nextConfig

