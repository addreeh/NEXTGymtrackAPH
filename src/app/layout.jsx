import { auth } from '@/auth'
import './globals.css'
import BottomNavbar from '@/components/BottomNavbar'
import localFont from 'next/font/local'
import { redirect } from 'next/navigation'

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

export default async function RootLayout ({ children }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <html lang='es'>
      <body className={`${eina03.className} bg-bg-app min-h-[100dvh] max-h-[100dvh] flex flex-col`}>
        <main className='flex-1 flex flex-col gap-6 overflow-y-auto p-5 overflow-y-hidden'>
          {children}
        </main>
        <BottomNavbar />
      </body>
    </html>
  )
}
