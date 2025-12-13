/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Only ignore build errors if you have a specific CI/CD setup
    // ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Keep this if you need it for static export
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Force cache clearing on deployment
  generateBuildId: async () => {
    // Generate a unique build ID based on timestamp
    return `build-${Date.now()}`
  },
  
  // Add cache-busting headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
}

export default nextConfig
