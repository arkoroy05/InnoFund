/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['undici'],
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    // Set the target environment
    if (!isServer) {
      config.target = 'web';
    }

    // Handle private class fields
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                browsers: ['last 2 versions', 'not dead', '> 0.2%'],
              },
              modules: false,
              useBuiltIns: 'usage',
              corejs: 3
            }]
          ],
          plugins: [
            ['@babel/plugin-transform-class-properties', { loose: true }],
            ['@babel/plugin-transform-private-methods', { loose: true }],
            ['@babel/plugin-transform-private-property-in-object', { loose: true }]
          ]
        }
      }
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "net": false,
        "tls": false,
        "fs": false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
