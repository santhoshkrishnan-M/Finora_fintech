/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ta', 'hi', 'te', 'ml', 'kn'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
