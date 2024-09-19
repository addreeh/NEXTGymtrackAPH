'use client'

import { Calendar, ChartNoAxesColumn, LayoutGrid, MessageSquare } from 'lucide-react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavbar () {
  const pathname = usePathname()

  return (
    <footer className='fixed bottom-0 w-full flex cursor-pointer flex-row justify-between px-5 text-white py-2'>
      <nav className='w-full'>
        <ul className='flex justify-around'>
          <li>
            <Link href='/' className={`flex flex-col items-center ${pathname === '/' ? 'text-white' : 'text-gray-500'}`}>
              <LayoutGrid className='h-7 w-7' />
            </Link>
          </li>
          <li>
            <Link href='/about' className={`flex flex-col items-center ${pathname === '/about' ? 'text-white' : 'text-gray-500'}`}>
              <Calendar className='h-7 w-7' />
            </Link>
          </li>
          <li>
            <Link href='/progress' className={`flex flex-col items-center ${pathname === '/progress' ? 'text-white' : 'text-gray-500'}`}>
              <ChartNoAxesColumn />
            </Link>
          </li>
          <li>
            <Link href='/contact' className={`flex flex-col items-center ${pathname === '/contact' ? 'text-white' : 'text-gray-500'}`}>
              <MessageSquare />
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}
