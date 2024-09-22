'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { capitalizeWords } from '@/lib/mix'
import { AnimatePresence, motion } from 'framer-motion'
import { Dumbbell, ChevronDown } from 'lucide-react'

import React, { useState } from 'react'

export default function DropdownExercises ({ exercises, selectedExercise, setSelectedExercise }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          size='icon'
          className={`rounded-full p-3 ${isOpen ? 'bg-[#ACA9AC] text-black' : 'bg-svg-bg text-white'}   cursor-pointer`}
          aria-label='Abrir menú de ejercicios de gimnasio'
        >
          <ChevronDown className={`h-6 w-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent asChild forceMount>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className='w-56 bg-svg-bg border-svg-border border-2 p-2 max-h-60 overflow-y-auto'
              id='exercises-menu'
            >
              {exercises.map((exercise, index) => (
                <React.Fragment key={exercise.id}>
                  <DropdownMenuItem
                    className={`flex gap-3 items-center ${
          selectedExercise?.id === exercise.id ? 'text-white/75' : 'text-white'
        }`}
                  >
                    <Dumbbell className='min-h-4 h-4 min-w-4 w-4' />
                    <span
                      className='text-ellipsis overflow-hidden truncate text-sm'
                      onClick={() => {
                        setSelectedExercise(exercise)
                      }}
                    >
                      {capitalizeWords(exercise.name)}
                    </span>
                  </DropdownMenuItem>
                  {index !== exercises.length - 1 && (
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