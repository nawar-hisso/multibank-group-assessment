const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js to read .env from the root directory
  env: {
    // Load environment variables from root .env file
    ...require('dotenv').config({ path: path.resolve(__dirname, '../.env') }).parsed,
  },
  images: {
    // Allow data URLs for placeholder images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
