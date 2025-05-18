/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['lh3.googleusercontent.com'], // For Google OAuth profile images
    },
    experimental: {
        // Enable server actions if needed
        serverActions: true,
    },
};

module.exports = nextConfig;