'use client'

import { capitalizeWords } from '@/lib/mix'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function CommandMenu ({ data }) {
  const [selectedExercise, setSelectedExercise] = useState('')
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between bg-white'
        >
          {(value.length > 0)
            ? capitalizeWords(allExercises.find((exercise) => exercise.value === value)?.label)
            : 'Select framework...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
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
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                    setSelectedExercise(currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === exercise.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {capitalizeWords(exercise.label)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Otros'>
              {otherExercises.map((exercise) => (
                <CommandItem
                  key={exercise.value}
                  value={exercise.label}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                    setSelectedExercise(currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === exercise.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {capitalizeWords(exercise.label)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
