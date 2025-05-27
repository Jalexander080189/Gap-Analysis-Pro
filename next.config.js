/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript and ESLint checks temporarily
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Add comprehensive CSP headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; img-src 'self' data: https:; connect-src 'self' https:;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
