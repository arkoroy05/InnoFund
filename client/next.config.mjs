/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // Ignores TypeScript errors during build
      ignoreBuildErrors: true,
    },
    eslint: {
      // Ignores ESLint errors during build
      ignoreDuringBuilds: true,
    },
  };
export default nextConfig;
