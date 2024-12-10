/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.us-east-2.amazonaws.com',
                pathname: '/sami4tiendas.sami-shop.com/**',

            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'resources-sami3.s3.us-west-1.amazonaws.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'resources-sami4.s3.us-west-1.amazonaws.com',
                pathname: '**',
            },
        ]
    }
};

export default nextConfig;
