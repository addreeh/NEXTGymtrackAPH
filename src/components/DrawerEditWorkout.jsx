'use client'

import { SlidersHorizontal, ArrowLeft, Trash, Calendar, ChevronRight, Crosshair } from 'lucide-react'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Drawer } from 'vaul'
import { motion, AnimatePresence } from 'framer-motion'
import { capitalizeWords } from '@/lib/mix'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const boxVariants = {
  hover: { scale: 1.05 },
  pressed: { scale: 0.95 }
}

const iconVariants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0 }
}

const tickVariants = {
  checked: { pathLength: 1 },
  unchecked: { pathLength: 0 }
}

export function DrawerEditWorkout ({ workout }) {
  console.log(workout)
  const [open, setOpen] = useState(true)
  const [workoutName, setWorkoutName] = useState(workout.name)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedDays, setSelectedDays] = useState({ [workout.day]: true })
  const [selectedExercises, setSelectedExercises] = useState([])
  const [exercises, setExercises] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/workout')
        const responseData = await response.json()

        console.log('API response:', responseData)
        setExercises(responseData.exercises)

        // Pre-seleccionar ejercicios que están en workout.routine_exercises
        const preSelectedExercises = {}
        workout.routine_exercises.forEach(routineExercise => {
          const exerciseId = routineExercise.exercise_definitions.id
          preSelectedExercises[exerciseId] = true
        })
        setSelectedExercises(preSelectedExercises)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [workout])

  const handleDaySelection = useCallback((day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }))
  }, [])

  const handleExercisesChange = useCallback((id) => {
    setSelectedExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  const renderExercises = () => {
    if (isLoading) {
      return <p className='text-white'>Loading exercises...</p>
    }

    if (exercises.length === 0) {
      return <p className='text-white'>No exercises found in the API response.</p>
    }

    return exercises.map((exercise) => (
      <div key={exercise.id} className='flex items-center space-x-2 gap-3'>
        <label className='relative flex items-center justify-center'>
          <motion.input
            type='checkbox'
            className='rounded-2xl border-2 border-svg-border bg-svg-bg relative h-14 w-14 cursor-pointer appearance-none transition-all duration-500 checked:border-svg-border checked:bg-white'
            onChange={() => handleExercisesChange(exercise.id)}
            checked={selectedExercises[exercise.id] || false}
            variants={boxVariants}
            whileHover='hover'
            whileTap='pressed'
          />
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center text-svg-text'>
            <motion.svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='3.5'
              stroke='currentColor'
              className='h-9 w-9 absolute'
              initial={false}
              animate={selectedExercises[exercise.id] ? 'visible' : 'hidden'}
              variants={iconVariants}
            >
              <motion.path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4.5 12.75l6 6 9-13.5'
                variants={tickVariants}
                initial='unchecked'
                animate={selectedExercises[exercise.id] ? 'checked' : 'unchecked'}
              />
            </motion.svg>
          </div>
        </label>
        <div className='flex flex-col'>
          <p className='text-white text-lg font-semibold'>{capitalizeWords(exercise.name)}</p>
          <p className='text-white/75 text-xs'>{exercise.muscle_group}</p>
        </div>
      </div>
    ))
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Drawer.Root open={open} shouldScaleBackground>
        <Drawer.Trigger asChild>
          <div className='rounded-full bg-svg-bg p-2.5 text-white cursor-pointer' onClick={() => setOpen(true)}>
            <SlidersHorizontal width={20} height={20} />
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 rounded-3xl bg-drawer-overlay border-2 border-drawer-border' />
          <Drawer.Content className='bg-drawer-bg flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0'>
            <div className='p-4 bg-drawer-bg rounded-t-[10px] flex-1'>
              <div className='mx-auto w-20 h-1 flex-shrink-0 rounded-full bg-white mb-4' />
              <div className='max-w-md mx-auto'>
                <div className='w-full flex flex-row justify-between items-center text-white mb-4 font-bold'>
                  <motion.div
                    animate={{ rotate: currentPage === 0 ? -90 : 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      if (currentPage > 0) setCurrentPage(currentPage - 1)
                      else setOpen(false)
                    }}
                  >
                    <ArrowLeft />
                  </motion.div>
                  <div className='rounded-full bg-red-500 p-2.5 text-white cursor-pointer' onClick={() => setOpen(true)}>
                    <Trash size={20} strokeWidth={2} />
                  </div>
                </div>
                <AnimatePresence initial={false} mode='wait'>
                  <motion.div
                    initial={{ x: '20%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-20%', opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ delay: 0, duration: 0.2 }}
                    className='flex flex-col gap-4'
                  >
                    {currentPage === 0 && (
                      <>
                        <Drawer.Title className='font-bold text-4xl text-white'>
                          Settings
                        </Drawer.Title>
                        <Drawer.Description className='text-white/75 text-xs'>
                          Edit settings for this workout
                        </Drawer.Description>
                        <motion.div
                          key={currentPage}
                          initial={{ x: '20%', opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: '-20%', opacity: 0, transition: { duration: 0.2 } }}
                          transition={{ delay: 0, duration: 0.2 }}
                          className='flex flex-col gap-4 px-2'
                        >
                          <input
                            type='text'
                            placeholder='Enter a name'
                            className='bg-transparent border-b-2 border-white/75 border-t-0 border-l-0 border-r-0 py-4 text-white'
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                          />
                          <div className='flex flex-col gap-6 w-full pt-4'>
                            <div className='flex flex-row text-white w-full gap-4 cursor-pointer' onClick={() => setCurrentPage(1)}>
                              <div className='rounded-full bg-svg-bg p-2.5 text-white cursor-pointer'>
                                <Calendar size={22} strokeWidth={2} />
                              </div>
                              <div className='w-full justify-between flex flex-row items-center'>
                                <div>
                                  <p className='text-white text-sm font-semibold'>Schedule</p>
                                  <p className='text-white/75 text-[10px]'>{workout.day}</p>
                                </div>
                                <ChevronRight size={20} strokeWidth={2} className='text-white/30' />
                              </div>
                            </div>
                            <div className='flex flex-row text-white w-full gap-4 cursor-pointer' onClick={() => setCurrentPage(2)}>
                              <div className='rounded-full bg-svg-bg p-2.5 text-white'>
                                <Crosshair size={22} strokeWidth={2} />
                              </div>
                              <div className='w-full justify-between flex flex-row items-center'>
                                <div>
                                  <p className='text-white text-sm font-semibold'>Exercises</p>
                                  <p className='text-white/75 text-[10px]'>Add more exercises to this workout</p>
                                </div>
                                <ChevronRight size={20} strokeWidth={2} className='text-white/30' />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                    {currentPage === 1 && (
                      <div className='flex flex-col gap-4'>
                        <p className='text-white border-b-2 pb-1 border-b-white/75 w-20'>Weekdays</p>
                        <p className='text-white/75'>On which <span className='text-white font-semibold'>days of the week</span> should this workout be performed?</p>
                        <div className='grid grid-cols-3 gap-x-3 gap-y-5'>
                          {days.map((day, index) => (
                            <div
                              key={index}
                              className={`flex justify-center items-center space-x-2 gap-3 font-semibold rounded-3xl p-3 cursor-pointer ${
                                selectedDays[day] ? 'bg-white text-drawer-bg' : 'bg-svg-bg text-white'
                              }`}
                              onClick={() => handleDaySelection(day)}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                        <p className='text-white/65 text-sm'>Pick weekdays to repeat this on</p>
                      </div>
                    )}

                    {currentPage === 2 && (
                      <div className='flex flex-col gap-4 h-[calc(100vh-250px)]' id='exercises'>
                        {renderExercises()}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Suspense>
  )
}
