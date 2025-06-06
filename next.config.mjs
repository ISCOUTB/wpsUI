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
  webpack(config) {
    config.resolve.symlinks = false; // 🔧 evita que webpack siga symlinks
    config.watchOptions = {
      ...config.watchOptions,
      followSymlinks: false, // 🔧 evita ciclos en vigilancia
    };
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [], // 🔧 desactiva paths cacheados
    };
    return config;
  },
};

export default nextConfig;
