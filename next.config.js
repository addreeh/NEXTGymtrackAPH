const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' }
    ]
  }
}

module.exports = withPWA(nextConfig)

// import MillionLint from '@million/lint'

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
//   images: {
//     remotePatterns: [
//       { hostname: 'lh3.googleusercontent.com' },
//       {
//         protocol: 'http',
//         hostname: 'localhost'
//       },
//       {
//         protocol: 'https',
//         hostname: 'gymtrackaph.vercel.app'
//       }
//     ]
//   }
// }

// export default MillionLint.next({ rsc: true })(nextConfig)
