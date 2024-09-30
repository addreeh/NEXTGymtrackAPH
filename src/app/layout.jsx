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

export const viewport = {
  themeColor: '#0A0A0C',
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  shrinkToFit: false,
  viewportFit: 'cover'
}

export const metadata = {
  title: 'GymtrackAPH',
  description: 'Effortlessly track your gym progress! Log workouts, monitor gains, and get personalized weight recommendations anytime, anywhere!',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['gymtrackaph', 'gym', 'fitness', 'weight', 'aph'],
  authors: [
    {
      name: 'Adrián Pino',
      url: 'https://www.linkedin.com/in/adrianpinohidalgo/'
    }
  ],
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/icon-128x128.png' },
    { rel: 'icon', url: 'icons/icon-128x128.png' }
  ]
}

export default async function RootLayout ({ children }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <html lang='es'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
        <meta name='generator' content={metadata.generator} />
        <link rel='manifest' href={metadata.manifest} />
        <meta name='keywords' content={metadata.keywords.join(', ')} />
        <meta name='author' content='Adrián Pino' url='https://www.github.com/addreeh/' />
        <meta name='viewport' content={metadata.viewport} />
        {metadata.icons.map(({ rel, url }, index) => (
          <link key={index} rel={rel} href={url} />
        ))}
      </head>
      <body className={`${eina03.className} bg-bg-app min-h-[100dvh] max-h-[100dvh] flex flex-col`}>
        <main className='flex-1 flex flex-col gap-6 p-5 overflow-y-hidden'>
          {children}
        </main>
        <BottomNavbar />
      </body>
    </html>
  )
}
