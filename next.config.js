/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                port: '',
                pathname: '/**',
            },
            { protocol: 'https', hostname: 'pub-17a73393d80349528c61ccd4ed8e3061.r2.dev', port: '', pathname: '/**' },
        ],
    },
}

module.exports = nextConfig 