/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove dangerous build ignores - enable proper error checking
  eslint: {
    // Only ignore during builds if you have a specific CI/CD setup
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // Only ignore build errors if you have a specific CI/CD setup
    // ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Keep this if you need it for static export
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
}

export default nextConfig
