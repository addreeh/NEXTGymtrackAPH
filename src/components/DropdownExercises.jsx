'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { capitalizeWords } from '@/lib/mix'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function DropdownExercises ({ exercises, setSelectedExercise }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          size='icon'
          className='rounded-full p-3 bg-svg-bg text-white cursor-pointer'
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
              className='w-56 bg-card-bg'
            >
              {exercises.map((exercise) => (
                <DropdownMenuItem key={exercise.id} className='flex items-center text-white'>
                  <span onClick={() => setSelectedExercise(exercise)}>{capitalizeWords(exercise.name)}</span>
                </DropdownMenuItem>
              ))}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}
