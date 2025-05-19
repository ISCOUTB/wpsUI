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
    typescript: {
      ignoreBuildErrors: true,
    },
}
  
  export default nextConfig