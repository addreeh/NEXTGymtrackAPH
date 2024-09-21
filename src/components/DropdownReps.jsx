'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { capitalizeWords } from '@/lib/mix'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChartNoAxesColumn } from 'lucide-react'
import React, { useState } from 'react'

export default function DropdownReps ({ selectedReps, setSelectedReps }) {
  const [isOpen, setIsOpen] = useState(false)

  const reps = [
    { id: 1, name: '1 Rep Max', value: 'max' },
    { id: 2, name: '1 Rep Min', value: 'min' },
    { id: 3, name: 'Average weight', value: 'avg' },
    { id: 4, name: 'Total data', value: 'all' }
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          size='icon'
          className={`rounded-full p-3 ${isOpen ? 'bg-[#ACA9AC] text-black' : 'bg-svg-bg text-white'} font-semibold cursor-pointer flex flex-row items-center text-sm w-full justify-between`}
          aria-label='Abrir menú de ejercicios de gimnasio'
        >
          <AnimatePresence mode='wait'>
            <motion.span
              key={selectedReps?.name}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedReps?.name}
            </motion.span>
          </AnimatePresence>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent asChild forceMount marginSide='left'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className='w-56 bg-svg-bg border-svg-border border-2 p-2'
            >
              {reps.map((exercise, index) => (
                <React.Fragment key={exercise.id}>
                  <DropdownMenuItem
                    className={`flex gap-3 items-center ${
                      selectedReps?.id === exercise.id ? 'text-white/60' : 'text-white'
                    }`}
                  >
                    <ChartNoAxesColumn className='min-h-4 h-4 min-w-4 w-4' />
                    <span
                      className='text-ellipsis overflow-hidden truncate text-sm'
                      onClick={() => {
                        setSelectedReps(exercise)
                      }}
                    >
                      {capitalizeWords(exercise.name)}
                    </span>
                  </DropdownMenuItem>
                  {index !== reps.length - 1 && (
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
