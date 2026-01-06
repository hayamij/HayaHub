/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['hayahub-domain', 'hayahub-business', 'hayahub-shared'],
  typedRoutes: true,
};

module.exports = nextConfig;
