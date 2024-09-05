/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**', // Wildcard to allow all subdomains
          },
        ],
      },
};

export default nextConfig;
