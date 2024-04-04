/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 100,
  images: {
    domains: ["i.imgur.com"], // Add 'i.imgur.com' to the list of allowed domains
  },
};

module.exports = nextConfig;
