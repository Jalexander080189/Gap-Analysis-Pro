/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript and ESLint checks temporarily
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Add CSP headers to allow inline scripts
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
