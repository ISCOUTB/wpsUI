// @ts-check

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
}

export default nextConfig
