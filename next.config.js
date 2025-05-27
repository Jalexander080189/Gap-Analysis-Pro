/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript and ESLint checks
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
  
  // No headers section at all
}

module.exports = nextConfig
