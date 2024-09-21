'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { capitalizeWords } from '@/lib/mix'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Calendar } from 'lucide-react'
import React, { useState } from 'react'

export default function DropdownTime ({ selectedTime, setSelectedTime }) {
  const [isOpen, setIsOpen] = useState(false)

  const time = [
    { id: 1, name: '1 month', value: 1 },
    { id: 2, name: '3 months', value: 3 },
    { id: 3, name: '1 year', value: 12 },
    { id: 4, name: 'All time', value: 'all' }
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          size='icon'
          className={`rounded-full p-3 ${isOpen ? 'bg-[#ACA9AC] text-black' : 'bg-svg-bg text-white'} cursor-pointer flex flex-row items-center text-sm font-semibold w-full justify-between`}
          aria-label='Abrir menú de ejercicios de gimnasio'
        >
          <AnimatePresence mode='wait'>
            <motion.span
              key={selectedTime?.name}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedTime?.name}
            </motion.span>
          </AnimatePresence>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent asChild forceMount marginSide='right'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className='w-56 bg-svg-bg border-svg-border border-2 p-2'
            >
              {time.map((t, index) => (
                <React.Fragment key={t.id}>
                  <DropdownMenuItem
                    className={`flex gap-3 items-center ${
                      selectedTime?.id === t.id ? 'text-white/75' : 'text-white'
                    }`}
                    onClick={() => setSelectedTime(t)}
                  >
                    <Calendar className='min-h-4 h-4 min-w-4 w-4' />
                    <span className='text-ellipsis overflow-hidden truncate text-sm'>
                      {capitalizeWords(t.name)}
                    </span>
                  </DropdownMenuItem>
                  {index !== time.length - 1 && (
                    <hr className='border-t-[1.5px] border-svg-border my-1 mx-2' />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}
