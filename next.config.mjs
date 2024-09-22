import MillionLint from '@million/lint'

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' } // Corregido: se cambió 'pattern' a 'hostname'
    ]
  }
}

export default MillionLint.next({ rsc: true })(nextConfig)
