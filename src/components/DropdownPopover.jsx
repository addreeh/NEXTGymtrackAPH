'use client'

import { useEffect, useState } from 'react'

import { motion, stagger, useAnimate } from 'framer-motion'

import { cn } from '@/lib/cn'
import { capitalizeWords } from '@/lib/mix'
import { Check, Settings } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'

function useMenuAnimation (isOpen) {
  const [scope, animate] = useAnimate()

  const staggerMenuItems = stagger(0.1, { startDelay: 0.15 })

  useEffect(() => {
    animate('#menu-icon', { rotate: isOpen ? 180 : 0 }, { duration: 0.2 })

    animate(
      'ul',
      {
        clipPath: isOpen
          ? 'inset(0% 0% 0% 0% round 12px)'
          : 'inset(10% 50% 90% 50% round 12px)'
      },
      {
        type: 'spring',
        bounce: 0,
        duration: 0.5
      }
    )

    animate(
      'li',
      isOpen
        ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
        : { opacity: 0, scale: 0.3, filter: 'blur(20px)' },
      {
        duration: 0.2,
        delay: isOpen ? staggerMenuItems : 0
      }
    )
  }, [isOpen, animate, staggerMenuItems])

  return scope
}

export function DropdownMenu ({
  data,
  containerClassName
}) {
  const [isOpen, setIsOpen] = useState(false)
  const scope = useMenuAnimation(isOpen)

  const allExercises = data.map((exercise) => ({
    value: exercise.name,
    label: exercise.name
  }))

  const basicExercises = data
    .filter((exercise) => exercise.exercise_type === 'Básico')
    .map((exercise) => ({
      value: exercise.name,
      label: exercise.name
    }))

  const otherExercises = data
    .filter((exercise) => exercise.exercise_type !== 'Básico')
    .map((exercise) => ({
      value: exercise.name,
      label: exercise.name
    }))

  return (
    <nav
      className={cn(
        'max-w-[200px] w-full mx-auto space-y-2',
        containerClassName
      )}
      ref={scope}
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        className='bg-neutral-900 border border-neutral-800 max-w-[300px] w-full flex items-center justify-between p-2.5 rounded-xl'
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <span className='text-sm font-medium text-neutral-300'>Settings</span>
        <div style={{ transformOrigin: '50% 55%' }}>
          <Settings size={14} className='text-neutral-400' id='menu-icon' />
        </div>
      </motion.button>
      <ul
        className={cn(
          'absolute z-[1] max-w-[200px] w-full space-y-3 p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        style={{
          clipPath: 'inset(10% 50% 90% 50% round 12px)'
        }}
      >
        <Command>
          <CommandInput placeholder='Search framework...' />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup heading='Básicos'>
              {basicExercises.map((exercise) => (
                <CommandItem
                  key={exercise.value}
                  value={exercise.label}
                  onSelect={(currentValue) => {
                    // setValue(currentValue === value ? '' : currentValue)
                    // setOpen(false)
                    // setSelectedExercise(currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4'

                    )}
                  />
                  {capitalizeWords(exercise.label)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Otros'>
              {otherExercises.map((exercise) => (
                <li key={exercise.value}>

                  <CommandItem
                    value={exercise.label}
                    onSelect={(currentValue) => {
                    // setValue(currentValue === value ? '' : currentValue)
                    // setOpen(false)
                    // setSelectedExercise(currentValue)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4'
                      )}
                    />
                    {capitalizeWords(exercise.label)}
                  </CommandItem>
                </li>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </ul>
    </nav>
  )
}
