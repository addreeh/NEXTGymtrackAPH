import './globals.css'
import BottomNavbar from '@/components/BottomNavbar'
import localFont from 'next/font/local'

const eina03 = localFont({
  src: [
    {
      path: './fonts/eina-03-regular.woff2',
      weight: 'normal',
      style: 'normal'
    },
    {
      path: './fonts/eina-03-bold.woff2',
      weight: 'bold',
      style: 'normal'
    },
    {
      path: './fonts/eina-03-semibold.woff2',
      weight: '600',
      style: 'normal'
    }
  ],
  variable: '--font-eina03'
})

export default function RootLayout ({ children }) {
  return (
    <html lang='es'>
      <body className={`${eina03.className} bg-black max-w-md mx-auto min-h-[100vh] max-h-screen overflow-hidden`}>
        <main>
          {children}
        </main>
        <BottomNavbar />
      </body>
    </html>
  )
}
