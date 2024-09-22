import MillionLint from '@million/lint'

const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com']
  }
}

export default MillionLint.next({ rsc: true })(nextConfig)
