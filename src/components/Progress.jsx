'use client'

import { useEffect, useState } from 'react'
import DropdownExercises from './DropdownExercises'
import { capitalizeWords } from '@/lib/mix'

export default function Progress ({ exercises, progress }) {
  const [selectedExercise, setSelectedExercise] = useState()
  const [chartData, setChartData] = useState([])
  console.log(chartData)

  useEffect(() => {
    const exercise = exercises.find(e => e.id === 5)
    setSelectedExercise(exercise)
  }, [])

  useEffect(() => {
    const data = []
    if (progress && selectedExercise) {
      progress.forEach(p => {
        if (p.exercise_id === selectedExercise.id) {
          data.push(p)
        }
      })
    }
    setChartData(data)
  }, [selectedExercise])

  return (
    <>
      <header className='flex flex-row w-full items-center justify-between'>
        <section className='flex flex-col gap-2'>
          <h1 className='text-4xl font-bold text-white'>{selectedExercise ? capitalizeWords(selectedExercise.name) : 'Bench Press'}</h1>
          <p className='text-card-text text-sm'>
            This section will show you your progress
          </p>
        </section>
        <DropdownExercises exercises={exercises} setSelectedExercise={setSelectedExercise} />
      </header>
      <main className='w-full' />
    </>
  )
}
