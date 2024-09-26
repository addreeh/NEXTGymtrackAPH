'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { capitalizeWords } from '@/lib/mix'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Dumbbell, ChevronDown } from 'lucide-react'

import React, { useState, useEffect, useRef, useCallback } from 'react'

const SearchInput = React.forwardRef(({ value, onChange }, ref) => (
  <div className='flex items-center bg-svg-bg border-svg-border border rounded-md mb-2 px-2'>
    <Search className='h-4 w-4 text-white/50' />
    <input
      ref={ref}
      type='text'
      value={value}
      onChange={onChange}
      placeholder='Type to search'
      className='bg-transparent text-white text-sm p-2 w-full focus:outline-none'
      onKeyDown={(e) => e.stopPropagation()}
    />
  </div>
))

export default function DropdownExercises ({ exercises, selectedExercise, setSelectedExercise, searchItem, handleInputChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredExercises, setFilteredExercises] = useState(exercises)
  const inputRef = useRef(null)

  useEffect(() => {
    const filteredItems = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchItem.toLowerCase())
    )
    setFilteredExercises(filteredItems)
  }, [exercises, searchItem])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleExerciseClick = useCallback((exercise) => {
    setSelectedExercise(exercise)
    setIsOpen(false)
  }, [setSelectedExercise])

  const handleOpenChange = useCallback((open) => {
    setIsOpen(open)
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 0)
    }
  }, [])

  const handleInputClick = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          size='icon'
          className={`rounded-full p-3 ${isOpen ? 'bg-[#ACA9AC] text-black' : 'bg-svg-bg text-white'} cursor-pointer`}
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
              onClick={handleInputClick}
            >
              <SearchInput ref={inputRef} value={searchItem} onChange={handleInputChange} />
              {filteredExercises.map((exercise, index) => (
                <React.Fragment key={exercise.id}>
                  <DropdownMenuItem
                    className={`flex gap-3 items-center ${
                      selectedExercise?.id === exercise.id ? 'text-white/75' : 'text-white'
                    }`}
                    onSelect={() => handleExerciseClick(exercise)}
                  >
                    <Dumbbell className='min-h-4 h-4 min-w-4 w-4' />
                    <span className='text-ellipsis overflow-hidden truncate text-sm'>
                      {capitalizeWords(exercise.name)}
                    </span>
                  </DropdownMenuItem>
                  {index !== filteredExercises.length - 1 && (
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
