'use client'

import { ChartNoAxesColumn, LayoutGrid, User } from 'lucide-react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

// Memoize the LayoutGrid component to prevent unnecessary re-renders
const MemoizedLayoutGrid = React.memo(LayoutGrid)

// Memoize the ChartNoAxesColumn component to prevent unnecessary re-renders
const MemoizedChartNoAxesColumn = React.memo(ChartNoAxesColumn)

export default function BottomNavbar () {
  const pathname = usePathname()

  return (
    <footer className='w-full bg-bg-app text-white py-2 h-16'>
      <nav>
        <ul className='flex justify-around'>
          <li>
            <Link href='/' className={`flex flex-col items-center ${pathname === '/' ? 'text-white' : 'text-gray-500'}`}>
              <MemoizedLayoutGrid className='h-7 w-7' />
            </Link>
          </li>
          <li>
            <Link href='/progress' className={`flex flex-col items-center ${pathname === '/progress' ? 'text-white' : 'text-gray-500'}`}>
              <MemoizedChartNoAxesColumn className='h-7 w-7' />
            </Link>
          </li>
          <li>
            <Link href='/profile' className={`flex flex-col items-center ${pathname === '/contact' ? 'text-white' : 'text-gray-500'}`}>
              <User className='h-7 w-7' />
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}
