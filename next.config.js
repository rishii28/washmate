/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ This bypasses TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig